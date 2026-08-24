# kde-osd-bottom-center

A KWin script that repositions Plasma's on-screen display (the volume,
brightness, mute, etc. overlay) to bottom-center, just above the panel,
instead of wherever KWin places it by default.

## What it does

`contents/code/main.js` watches for OSD windows (`win.onScreenDisplay`) and,
each time one is shown, resized, or moved to another output, recalculates its
position from the active screen's work area: horizontally centered, with a
fixed 32px gap above the bottom edge (clamped so an unusually tall OSD never
gets pushed flush against the top of the work area). It follows
`workspace.activeScreen`, so on multi-monitor setups the OSD still appears on
the same output KWin chose, only lower.

## Installing

Install as a KWin script package and enable it:

```sh
kpackagetool6 --type=KWin/Script --install /path/to/patches/kwin/kwinscripts/kde-osd-bottom-center
kwriteconfig6 --file kwinrc --group Plugins --key kde-osd-bottom-centerEnabled true
qdbus org.kde.KWin /KWin reconfigure
```

To update an already-installed copy, use `--upgrade` instead of `--install`.
The script can also be enabled/disabled from System Settings ->
Window Management -> KWin Scripts once installed.
