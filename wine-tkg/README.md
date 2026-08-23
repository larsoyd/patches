# Wine-tkg patches

These `.mypatch` files target the Wine source used by wine-tkg. Their numeric
prefixes preserve the intended application order.

## Patches

### `0006-comdlg32-use-XDG-Desktop-Portal-for-native-file-dial.mypatch`

Adds XDG Desktop Portal-backed native file and folder dialogs to `comdlg32` and
`shell32`. Portal use can be selected in winecfg with the auto, always, or never
policy, or forced with `WINE_FORCE_PORTAL=1`.

### `0007-comdlg32-fix-portal-dialog-compatibility-and-respons.mypatch`

Builds on patch 0006 to improve portal dialog compatibility with applications
such as Affinity. It accepts compatible event listeners and cosmetic options,
and keeps the Windows message loop responsive while a portal request is open.

### `0011-winewayland-server-side-decorations.mypatch`

Adds `xdg-decoration` support to Wine's Wayland driver and requests server-side
decorations where the compositor supports them. Set `WAYLANDDRV_SSD=0` to
disable the feature. This version is rebased for Wine 11.15 and wine-tkg patch
ordering.

### `0012-ntdll-implement-mui-satellite-resource-redirection.mypatch`

Implements Windows Vista+ MUI (Multilingual User Interface) satellite
resource redirection in `dlls/ntdll/resource.c`. A module shipped as
"language neutral" (LN) — most/all of its strings, dialogs, menus, etc.
stripped into a separate `<lang>\<module>.mui` satellite PE — previously
had every such resource lookup fail outright under Wine, since nothing
ever looked for the satellite file. This affects any Vista-era app built
this way; found and confirmed via Windows Movie Maker 6.0, whose startup
failure (a generic "Call failed." E_FAIL dialog) traced back to exactly
this gap. Confirmed fixed both via a minimal winegcc harness and against
the real application, which now reaches its normal main window.

## Applying

Use the files as wine-tkg custom patches, retaining their numeric order. They
can also be applied in order from the root of a compatible Wine checkout:

```sh
git apply /path/to/patches/wine-tkg/0006-comdlg32-use-XDG-Desktop-Portal-for-native-file-dial.mypatch
git apply /path/to/patches/wine-tkg/0007-comdlg32-fix-portal-dialog-compatibility-and-respons.mypatch
git apply /path/to/patches/wine-tkg/0011-winewayland-server-side-decorations.mypatch
git apply /path/to/patches/wine-tkg/0012-ntdll-implement-mui-satellite-resource-redirection.mypatch
```

Patch 0007 depends on patch 0006. The server-side decoration patch and the MUI
resource redirection patch are each independent of the rest of the series.
