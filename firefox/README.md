# Firefox patches

Patches in this directory target the Mozilla Firefox source tree.

## Patches

### `0002-Clear-overLink-on-click-even-if-content-prevents-de.patch`

Clears `XULBrowserWindow.overLink` after a trusted primary-button content
click, including when page code calls `preventDefault()`. This prevents the
link-target status panel from becoming stuck when an SPA-style click removes
or replaces the hovered link without producing the usual pointer-leave event.

The patch adds child-to-parent click notification handling and a browser test
covering the intercepted-click case. Its commit message contains detailed
rationale and links to the related Mozilla bug reports.

## Applying

This is a Git format-patch, so apply it from the root of a Firefox checkout:

```sh
git am /path/to/patches/firefox/0002-Clear-overLink-on-click-even-if-content-prevents-de.patch
```
