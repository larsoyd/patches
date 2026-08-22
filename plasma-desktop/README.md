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

After a task has been hovered for 300 ms, scrolls an overflowing, single-line
Task Manager label to reveal its end. It pauses there for 500 ms, then animates
back to the beginning even if the pointer remains over the task; leaving the
task also starts the return immediately. Title or available-width changes
reset the label and rearm scrolling when appropriate.

The patch extends the shared scrolling wrapper with an external hover source,
configurable timing, automatic and animated return, and content-change
handling. These behaviors are opt-in so its existing Player Controller use
keeps the original behavior, while the Task Manager disables the wrapper's
own mouse handling to preserve the task's click and preview-hover handling.

## Applying

The patches affect separate QML components and can be applied independently
from the root of a Plasma Desktop checkout:

```sh
git apply /path/to/patches/plasma-desktop/plasma-kickoff-footer-arch.patch
git apply /path/to/patches/plasma-desktop/plasma-unselect.patch
git apply /path/to/patches/plasma-desktop/plasma-taskmanager-hover-scroll.patch
```
