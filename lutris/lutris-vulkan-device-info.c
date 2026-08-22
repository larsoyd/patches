// SPDX-License-Identifier: GPL-3.0-or-later

#define _POSIX_C_SOURCE 200809L

#include <stdint.h>
#include <stdio.h>
#include <stdlib.h>

#include <vulkan/vulkan.h>

static void print_json_string(const char *value)
{
    const unsigned char *character = (const unsigned char *)value;

    putchar('"');
    while (*character) {
        switch (*character) {
        case '"':
            fputs("\\\"", stdout);
            break;
        case '\\':
            fputs("\\\\", stdout);
            break;
        case '\b':
            fputs("\\b", stdout);
            break;
        case '\f':
            fputs("\\f", stdout);
            break;
        case '\n':
            fputs("\\n", stdout);
            break;
        case '\r':
            fputs("\\r", stdout);
            break;
        case '\t':
            fputs("\\t", stdout);
            break;
        default:
            if (*character < 0x20)
                printf("\\u%04x", *character);
            else
                putchar(*character);
        }
        character++;
    }
    putchar('"');
}

static void format_uuid(const uint8_t uuid[VK_UUID_SIZE], char output[37])
{
    snprintf(output, 37,
             "%02x%02x%02x%02x-%02x%02x-%02x%02x-%02x%02x-"
             "%02x%02x%02x%02x%02x%02x",
             uuid[0], uuid[1], uuid[2], uuid[3],
             uuid[4], uuid[5], uuid[6], uuid[7],
             uuid[8], uuid[9], uuid[10], uuid[11],
             uuid[12], uuid[13], uuid[14], uuid[15]);
}

int main(void)
{
    const VkApplicationInfo application_info = {
        .sType = VK_STRUCTURE_TYPE_APPLICATION_INFO,
        .pApplicationName = "lutris-vulkan-device-info",
        .applicationVersion = VK_MAKE_API_VERSION(0, 1, 0, 0),
        .pEngineName = NULL,
        .engineVersion = 0,
        .apiVersion = VK_API_VERSION_1_1,
    };
    const VkInstanceCreateInfo instance_info = {
        .sType = VK_STRUCTURE_TYPE_INSTANCE_CREATE_INFO,
        .pApplicationInfo = &application_info,
    };
    VkInstance instance;
    VkPhysicalDevice *devices = NULL;
    uint32_t device_count = 0;
    VkResult result;
    int exit_status = EXIT_FAILURE;

    unsetenv("DISPLAY");
    unsetenv("WAYLAND_DISPLAY");

    result = vkCreateInstance(&instance_info, NULL, &instance);
    if (result != VK_SUCCESS) {
        fprintf(stderr, "lutris-vulkan-device-info: vkCreateInstance failed (%d)\n", result);
        return EXIT_FAILURE;
    }

    result = vkEnumeratePhysicalDevices(instance, &device_count, NULL);
    if (result != VK_SUCCESS) {
        fprintf(stderr, "lutris-vulkan-device-info: device count query failed (%d)\n", result);
        goto cleanup;
    }

    if (device_count > 0) {
        devices = malloc(device_count * sizeof(*devices));
        if (!devices) {
            fputs("lutris-vulkan-device-info: unable to allocate device list\n", stderr);
            goto cleanup;
        }

        result = vkEnumeratePhysicalDevices(instance, &device_count, devices);
        if (result != VK_SUCCESS) {
            fprintf(stderr, "lutris-vulkan-device-info: device enumeration failed (%d)\n", result);
            goto cleanup;
        }
    }

    puts("[");
    for (uint32_t index = 0; index < device_count; index++) {
        VkPhysicalDeviceIDProperties id_properties = {
            .sType = VK_STRUCTURE_TYPE_PHYSICAL_DEVICE_ID_PROPERTIES,
        };
        VkPhysicalDeviceProperties2 properties = {
            .sType = VK_STRUCTURE_TYPE_PHYSICAL_DEVICE_PROPERTIES_2,
            .pNext = &id_properties,
        };
        char uuid[37];

        vkGetPhysicalDeviceProperties2(devices[index], &properties);
        format_uuid(id_properties.deviceUUID, uuid);

        fputs("  {\"name\": ", stdout);
        print_json_string(properties.properties.deviceName);
        printf(", \"uuid\": \"%s\", \"vendor_id\": %u, \"device_id\": %u, "
               "\"device_type\": %u}%s\n",
               uuid,
               properties.properties.vendorID,
               properties.properties.deviceID,
               properties.properties.deviceType,
               index + 1 < device_count ? "," : "");
    }
    puts("]");
    exit_status = ferror(stdout) ? EXIT_FAILURE : EXIT_SUCCESS;

cleanup:
    free(devices);
    vkDestroyInstance(instance, NULL);
    return exit_status;
}
