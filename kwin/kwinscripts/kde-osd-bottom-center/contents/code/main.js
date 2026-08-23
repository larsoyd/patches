"use strict";

// Distance between the OSD and the top edge of a bottom panel/work area.
// 32 logical pixels keeps it clearly above the taskbar while still feeling low.
const GAP = 32;

// Prevent an unusually large OSD or work-area oddity from placing it flush
// against the top edge of the usable area.
const TOP_GUARD = 16;

function positionOsd(win) {
    if (!win || !win.onScreenDisplay) {
        return;
    }

    const g = win.frameGeometry;
    if (!g || g.width <= 0 || g.height <= 0) {
        return;
    }

    // KWin itself places OSDs on the active output. Following activeScreen here
    // preserves that behavior on multi-monitor setups while changing only the
    // final position.
    const output = workspace.activeScreen || win.output;
    if (!output) {
        return;
    }

    const desktop = workspace.currentDesktopForScreen(output) || workspace.currentDesktop;
    const work = workspace.clientArea(KWin.MaximizeArea, output, desktop);

    const x = Math.round(work.x + (work.width - g.width) / 2);
    const desiredY = Math.round(work.y + work.height - g.height - GAP);
    const y = Math.max(Math.round(work.y + TOP_GUARD), desiredY);

    // frameGeometryChanged fires for our own move too, so skip when the OSD is
    // already where it belongs.
    if (Math.abs(g.x - x) < 0.5 && Math.abs(g.y - y) < 0.5) {
        return;
    }

    // frameGeometry must be replaced as a complete rectangle object. Mutating
    // frameGeometry.x/y in place is not reliable in KWin scripts.
    const next = Object.assign({}, g);
    next.x = x;
    next.y = y;
    win.frameGeometry = next;
}

function attach(win) {
    if (!win || !win.onScreenDisplay) {
        return;
    }

    positionOsd(win);

    // Plasma reuses its OSD window, so windowAdded alone is insufficient.
    win.windowShown.connect(function () {
        positionOsd(win);
    });

    // KWin can re-place an OSD when its size changes. Reapply the intended
    // position after that happens.
    win.frameGeometryChanged.connect(function () {
        positionOsd(win);
    });

    // Keep the position correct when KWin moves the OSD to another monitor.
    win.outputChanged.connect(function () {
        positionOsd(win);
    });
}

workspace.windowAdded.connect(attach);

// Also catch an OSD window that already exists when the script is enabled.
for (const win of workspace.stackingOrder) {
    attach(win);
}
