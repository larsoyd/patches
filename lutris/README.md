# Lutris patches

Patches in this directory target the Lutris source tree.

## Patches

### `fix-gtk3-version-selection.patch`

Requires GTK and GDK 3.0 through PyGObject when the main Lutris package is
initialized. This makes the intended toolkit versions explicit before their
namespaces are imported elsewhere.

### `avoid-vulkaninfo-for-gpu-identity.patch`

Replaces parsing of `vulkaninfo --summary` with a single cached call to
`/usr/lib/lutris/lutris-vulkan-device-info`. The helper's JSON output supplies
the Vulkan device name and UUID, while Lutris continues to fall back to the
`lspci` name when no Vulkan name is available.

This patch assumes the helper is installed at the path above and returns a
JSON list containing `vendor_id`, `device_id`, `name`, and `uuid` fields.

## Applying

The patches are independent and can be applied as needed from the root of a
Lutris checkout:

```sh
git apply /path/to/patches/lutris/fix-gtk3-version-selection.patch
git apply /path/to/patches/lutris/avoid-vulkaninfo-for-gpu-identity.patch
```
