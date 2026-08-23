# Firefox browser-chrome customizations

These files customize Firefox's own interface rather than web-page content.
They are independent: `userChrome.css` can be used without the script, and the
script can be used without the stylesheet.

## `userChrome.css`

The stylesheet makes three changes to the tab strip and titlebar:

- removes each tab's close button and its speaker, mute, and blocked-autoplay
  indicators;
- draws a green inset border around tabs that are playing audio; and
- replaces Firefox's minimize, maximize, restore, and close artwork with the
  matching KDE Breeze GTK titlebar buttons, including their hover states.

The titlebar images are referenced through a `buttons/` directory beside
`userChrome.css`. They are symlinked rather than copied so they continue to
come from the installed Breeze GTK theme. The stylesheet expects this layout:

```text
chrome/
├── userChrome.css
└── buttons/
    ├── close-active.svg
    ├── close-normal.svg
    ├── maximize-hover.svg
    ├── maximize-normal.svg
    ├── maximized-hover.svg
    ├── maximized-normal.svg
    ├── minimize-hover.svg
    └── minimize-normal.svg
```

The names map to Breeze GTK assets as follows:

| Local name | Breeze asset |
| --- | --- |
| `minimize-normal.svg` | `breeze-minimize-symbolic.svg` |
| `minimize-hover.svg` | `breeze-minimize-hover-symbolic.svg` |
| `maximize-normal.svg` | `breeze-maximize-symbolic.svg` |
| `maximize-hover.svg` | `breeze-maximize-hover-symbolic.svg` |
| `maximized-normal.svg` | `breeze-maximized-symbolic.svg` |
| `maximized-hover.svg` | `breeze-maximized-hover-symbolic.svg` |
| `close-normal.svg` | `breeze-close-symbolic.svg` |
| `close-active.svg` | `breeze-close-active-symbolic.svg` |

The assets normally live in `/usr/share/themes/Breeze/assets/` or
`/usr/share/themes/Breeze-Dark/assets/`. Choose the variant matching the
Firefox theme, create the links under the profile's `chrome/buttons/`
directory, and keep the local names shown above. Absolute links are suitable
for a local profile but are deliberately not committed because the system
theme path and light/dark choice vary between installations.

To enable the stylesheet:

1. Open `about:support` and use **Profile Directory** to locate the active
   Firefox profile.
2. Create its `chrome/` directory if necessary and copy `userChrome.css` into
   it.
3. Create `chrome/buttons/` and add the Breeze asset symlinks described above.
4. In `about:config`, set
   `toolkit.legacyUserProfileCustomizations.stylesheets` to `true`.
5. Restart Firefox completely.

Firefox must be drawing its own titlebar controls for the replacement button
rules to be visible. If native window decorations are enabled instead, the
desktop compositor owns those buttons and `userChrome.css` cannot change them.

## `hover-select-split-view.uc.js`

This script makes selection follow the mouse inside Firefox Split View. When
the pointer enters the other active split pane and remains there for 100 ms,
the script finds the tab associated with that pane and assigns it as the
selected tab. Moving away before the delay expires cancels the selection.

Only unpressed mouse movement is handled. Touch or pen input and pointer
movement during a drag are ignored. An installation guard prevents duplicate
listeners, and the timer and listeners are removed when the browser window is
unloaded.

Firefox does not natively execute arbitrary `.uc.js` files from a profile.
Install a userChromeJS loader compatible with the Firefox version in use, then
place `hover-select-split-view.uc.js` in the location that loader scans
(commonly the profile's `chrome/` directory) and restart Firefox. Loader setup
varies, so its own installation instructions take precedence.

The script relies on Firefox-internal objects and Split View markup, including
`gBrowser.activeSplitView`. Those interfaces can change between Firefox
releases; if hover selection stops working, check the Browser Console for
errors and compare the selectors and tab mapping with the current browser UI.
