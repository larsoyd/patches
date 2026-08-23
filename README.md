# Patch and customization collection

This repository contains small, project-specific patches and local
customizations maintained for packaging or personal use. Files are grouped by
the upstream project they apply to; each directory documents their purpose and
how to install or apply them.

## Projects

| Directory | Project | Contents | Summary |
| --- | --- | ---: | --- |
| [`firefox/`](firefox/) | Mozilla Firefox | 1 patch, 2 profile customizations | Fixes a stuck link-target panel, uses KDE/GTK titlebar buttons, and selects Split View panes on hover. |
| [`lutris/`](lutris/) | Lutris | 2 | Selects GTK 3 explicitly and obtains Vulkan GPU identity without parsing `vulkaninfo`. |
| [`plasma-desktop/`](plasma-desktop/) | KDE Plasma Desktop | 3 | Adjusts Kickoff and Folder View behavior and scrolls overflowing Task Manager labels on hover. |
| [`wine-tkg/`](wine-tkg/) | Wine-tkg | 3 | Adds portal-backed file dialogs and Wine Wayland server-side decorations. |
| [`kpipewire/`](kpipewire/) | KPipewire | 1 | Fixes a bug where KDE's task thumbnails on the taskbar would not work by raising a buffer. |

## Using the files

Follow the instructions in the relevant project directory. Apply source
patches from a clean upstream checkout, and install user-level customizations
in the location documented for them. Review patches before applying them and
confirm that they target the version being built; these files do not carry
universal version compatibility guarantees.

The repository's [`LICENSE`](LICENSE) applies to this collection. Individual
upstream files remain subject to their original projects' licenses.
