# Patch collection

This repository contains small, project-specific patches maintained for local
packaging or use. Patches are grouped by the upstream source tree they apply
to; each directory documents the purpose of its patches and how to apply them.

## Projects

| Directory | Project | Patches | Summary |
| --- | --- | ---: | --- |
| [`firefox/`](firefox/) | Mozilla Firefox | 1 | Prevent a link-target status panel from remaining visible after an intercepted click. |
| [`lutris/`](lutris/) | Lutris | 2 | Select GTK 3 explicitly and obtain Vulkan GPU identity without parsing `vulkaninfo`. |
| [`plasma-desktop/`](plasma-desktop/) | KDE Plasma Desktop | 3 | Adjust Kickoff and Folder View behavior and scroll overflowing Task Manager labels on hover. |
| [`wine-tkg/`](wine-tkg/) | Wine-tkg | 3 | Add portal-backed file dialogs and Wine Wayland server-side decorations. |

## Applying patches

Run the command documented in the relevant project directory from a clean
upstream source checkout. Review the patch first and confirm that it targets
the source version being built; these patches do not carry universal version
compatibility guarantees.

The repository's [`LICENSE`](LICENSE) applies to this collection. Individual
upstream files remain subject to their original projects' licenses.
