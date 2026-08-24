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

### `0013-wmvcore-implement-loadprofilebydata-profile-xml-par.mypatch`

Implements `IWMProfileManager::LoadProfileByData` in `dlls/wmvcore` — a
complete `E_NOTIMPL` stub previously — by parsing the Windows Media
profile-XML schema (via xmllite) into a real, working `IWMProfile3`/
`IWMStreamConfig`/`IWMMediaProps` object graph (new `dlls/wmvcore/profile.c`).
Found and confirmed via Windows Movie Maker 6.0's bug #3: its own
`CWMTProfileManager::CreateProfileFromData` detects the stub's `E_NOTIMPL`
but (a latent app-side bug never exercised on real Windows) synthesizes a
soft `S_FALSE`/NULL instead of propagating it, and its caller three frames
up dereferences the NULL profile pointer without checking it — a crash a
few seconds into the app's post-startup idle-loop initialization. Confirmed
fixed both via `harness/wmprofile-loadbydata/` (fails with `E_NOTIMPL` against
the unpatched stub, passes with correct stream/media-type field values
against this patch) and against the real application, whose main window
now survives well past the former crash point with zero `wmvcore` fixme
lines across all 31 bundled profiles.

### `0014-comdlg32-treat-IFileSaveDialog-cosmetic-property-st.mypatch`

`IFileSaveDialog::SetCollectedProperties()` and `IFileSaveDialog::SetSaveAsItem()`
were complete `E_NOTIMPL` stubs, even though both are purely cosmetic/UI-hint
methods on real Windows that never affect whether a save actually succeeds. An
application that checks `SUCCEEDED()` after either call (reasonable, since real
Windows never fails them for ordinary arguments) never reaches `Show()` at all —
the Save dialog silently never appears. Found via Windows Movie Maker 6.0: 

File Save produced no visible dialog. Raw disassembly of MOVIEMK.dll's internal
`ComGetSaveFileName` helper showed the exact `SetCollectedProperties(NULL,
FALSE)` call and its `SUCCEEDED()` gate, matching the live trace byte-for-byte;
`SetSaveAsItem` was a second, later gate in the same chain. Both are now
treated like the already-non-fatal `IFileDialog2_fnAddPlace` stub next to them
(FIXME kept, return `S_OK` instead of `E_NOTIMPL`). Confirmed via a minimal
winegcc harness against the real `comdlg32.dll` (`E_NOTIMPL` before, `S_OK`
after) and against the real application: the Save dialog now appears, and a
saved project is written to disk and registered in the shell's Recent Items.

### `0015-quartz-implement-filter-graph-service-providers.mypatch`

Adds DirectShow's missing `IRegisterServiceProvider` declaration and implements both
`IRegisterServiceProvider` and `IServiceProvider` on quartz's threaded and no-thread Filter
Graph Manager objects. A critical-section-protected SID registry owns registered COM objects
until replacement, explicit `NULL` unregistration, or graph destruction; `QueryService`
forwards the requested IID to the registered object. Found through Windows Movie Maker 6.0:
`Pipeline.dll!CreateFilterGraphPriv` requires this interface, and Wine's former
`E_NOINTERFACE` aborted preview graph construction. Confirmed by a minimal real-COM harness
(fails against the installed unpatched graph, passes all registration/query/lifetime checks
against the patch) and against the real application, where timeline playback works and title
overlays are reachable again.

## Applying

Use the files as wine-tkg custom patches, retaining their numeric order. They
can also be applied in order from the root of a compatible Wine checkout:

```sh
git apply /path/to/patches/wine-tkg/0006-comdlg32-use-XDG-Desktop-Portal-for-native-file-dial.mypatch
git apply /path/to/patches/wine-tkg/0007-comdlg32-fix-portal-dialog-compatibility-and-respons.mypatch
git apply /path/to/patches/wine-tkg/0011-winewayland-server-side-decorations.mypatch
git apply /path/to/patches/wine-tkg/0012-ntdll-implement-mui-satellite-resource-redirection.mypatch
git apply /path/to/patches/wine-tkg/0013-wmvcore-implement-loadprofilebydata-profile-xml-par.mypatch
git apply /path/to/patches/wine-tkg/0014-comdlg32-treat-IFileSaveDialog-cosmetic-property-st.mypatch
git apply /path/to/patches/wine-tkg/0015-quartz-implement-filter-graph-service-providers.mypatch
```

Patch 0007 depends on patch 0006. The server-side decoration patch, the MUI
resource redirection patch, the wmvcore profile-XML patch, and the
IFileSaveDialog cosmetic-stub patch, and the quartz service-provider patch are each independent
of the rest of the series.
