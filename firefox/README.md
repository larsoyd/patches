# Firefox patches and profile customizations

This directory contains a Firefox source patch as well as local browser-chrome
customizations.

## Patches

### `0002-Clear-overLink-on-click-even-if-content-prevents-de.patch`

Clears `XULBrowserWindow.overLink` after a trusted primary-button content
click, including when page code calls `preventDefault()`. This prevents the
link-target status panel from becoming stuck when an SPA-style click removes
or replaces the hovered link without producing the usual pointer-leave event.

The patch adds child-to-parent click notification handling and a browser test
covering the intercepted-click case. Its commit message contains detailed
rationale and links to the related Mozilla bug reports.

## Applying the patch

This is a Git format-patch, so apply it from the root of a Firefox checkout:

```sh
git am /path/to/patches/firefox/0002-Clear-overLink-on-click-even-if-content-prevents-de.patch
```

## Profile customizations

The [`chrome/`](chrome/) directory contains two independent profile-level
customizations:

- `userChrome.css` hides tab close and audio buttons, marks audible tabs with
  a green inset border, and replaces Firefox's titlebar controls with the KDE
  Breeze GTK button artwork.
- `hover-select-split-view.uc.js` selects the Firefox Split View pane under the
  pointer after a short hover, so focus can follow the mouse without a click.

See [`chrome/README.md`](chrome/README.md) for behavior, requirements, and
installation instructions. These files target Firefox's internal browser UI,
which is not a stable extension API and may require updates after Firefox
changes.
