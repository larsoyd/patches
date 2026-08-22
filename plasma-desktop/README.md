# Plasma Desktop patches

Patches in this directory target the KDE Plasma Desktop source tree.

## Patches

### `plasma-kickoff-footer-arch.patch`

Changes the Kickoff application launcher's footer layout so the relevant
footer item is anchored to the left of the tab bar, with the standard spacing,
rather than to the right edge of its parent.

### `plasma-unselect.patch`

Clears Folder View's selection and current-index bookkeeping after an item is
launched. The deferred reset avoids leaving the launched desktop item selected.

### `plasma-taskmanager-hover-scroll.patch`

Scrolls an overflowing, single-line Task Manager label while its task is
hovered, then returns it to the beginning. The shared scrolling wrapper gains
configurable delays, animated return behavior, and content-change handling
without taking over the task's existing hover or click handling.

## Applying

The patches affect separate QML components and can be applied independently
from the root of a Plasma Desktop checkout:

```sh
git apply /path/to/patches/plasma-desktop/plasma-kickoff-footer-arch.patch
git apply /path/to/patches/plasma-desktop/plasma-unselect.patch
git apply /path/to/patches/plasma-desktop/plasma-taskmanager-hover-scroll.patch
```
