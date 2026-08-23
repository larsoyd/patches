(() => {
    "use strict";

    const INSTALL_GUARD = "__hoverSelectSplitViewInstalled";
    const HOVER_DELAY_MS = 100;

    if (window[INSTALL_GUARD]) {
        return;
    }

    window[INSTALL_GUARD] = true;

    let hoverTimer = 0;
    let pendingPanel = null;

    function getSplitPanel(node) {
        return node instanceof Element
            ? node.closest(
                  ".browserSidebarContainer.split-view-panel-active"
              )
            : null;
    }

    function clearPendingHover() {
        if (hoverTimer) {
            window.clearTimeout(hoverTimer);
            hoverTimer = 0;
        }

        pendingPanel = null;
    }

    function getTabForPanel(panel) {
        const splitView = gBrowser.activeSplitView;

        if (!splitView) {
            return null;
        }

        return (
            splitView.tabs.find(
                tab => tab.linkedPanel === panel.id
            ) ?? null
        );
    }

    function onPointerOver(event) {
        if (event.pointerType && event.pointerType !== "mouse") {
            return;
        }

        if (event.buttons !== 0) {
            clearPendingHover();
            return;
        }

        const panel = getSplitPanel(event.target);

        if (!panel) {
            return;
        }

        const previousPanel = getSplitPanel(event.relatedTarget);

        if (previousPanel === panel) {
            return;
        }

        const tab = getTabForPanel(panel);

        if (!tab || tab === gBrowser.selectedTab) {
            clearPendingHover();
            return;
        }

        clearPendingHover();
        pendingPanel = panel;

        hoverTimer = window.setTimeout(() => {
            hoverTimer = 0;

            if (pendingPanel !== panel) {
                return;
            }

            pendingPanel = null;

            if (!panel.isConnected || !panel.matches(":hover")) {
                return;
            }

            const currentTab = getTabForPanel(panel);

            if (
                currentTab &&
                currentTab !== gBrowser.selectedTab
            ) {
                gBrowser.selectedTab = currentTab;
            }
        }, HOVER_DELAY_MS);
    }

    function onPointerOut(event) {
        const panel = getSplitPanel(event.target);

        if (!panel || pendingPanel !== panel) {
            return;
        }

        const nextPanel = getSplitPanel(event.relatedTarget);

        if (nextPanel !== panel) {
            clearPendingHover();
        }
    }

    const tabPanels = gBrowser.tabpanels;

    tabPanels.addEventListener(
        "pointerover",
        onPointerOver,
        true
    );

    tabPanels.addEventListener(
        "pointerout",
        onPointerOut,
        true
    );

    window.addEventListener(
        "unload",
        () => {
            clearPendingHover();

            tabPanels.removeEventListener(
                "pointerover",
                onPointerOver,
                true
            );

            tabPanels.removeEventListener(
                "pointerout",
                onPointerOut,
                true
            );

            delete window[INSTALL_GUARD];
        },
        { once: true }
    );

    console.info(
        `[split-hover] enabled with ${HOVER_DELAY_MS} ms delay`
    );
})();
