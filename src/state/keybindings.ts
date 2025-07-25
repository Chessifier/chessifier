import { atomWithStorage } from "jotai/utils";
import type { SyncStorage, SyncStringStorage } from "jotai/vanilla/utils/atomWithStorage";

const keys = {
  // === File Operations ===
  OPEN_FILE: { name: "Open File", keys: "mod+o" },
  SAVE_FILE: { name: "Save File", keys: "mod+s" },
  EXIT_APP: { name: "Exit Chessifier", keys: "mod+shift+q" },

  // === Board Tabs ===
  NEW_BOARD_TAB: { name: "New board tab", keys: "mod+t" },
  CLOSE_BOARD_TAB: { name: "Close board tab", keys: "mod+w" },
  CYCLE_BOARD_TABS: { name: "Cycle board tabs", keys: "ctrl+tab" },
  REVERSE_CYCLE_BOARD_TABS: { name: "Reverse cycle board tabs", keys: "ctrl+shift+tab" },

  BOARD_TAB_ONE: { name: "Go to board tab one", keys: "ctrl+alt+1" },
  BOARD_TAB_TWO: { name: "Go to board tab two", keys: "ctrl+alt+2" },
  BOARD_TAB_THREE: { name: "Go to board tab three", keys: "ctrl+alt+3" },
  BOARD_TAB_FOUR: { name: "Go to board tab four", keys: "ctrl+alt+4" },
  BOARD_TAB_FIVE: { name: "Go to board tab five", keys: "ctrl+alt+5" },
  BOARD_TAB_SIX: { name: "Go to board tab six", keys: "ctrl+alt+6" },
  BOARD_TAB_SEVEN: { name: "Go to board tab seven", keys: "ctrl+alt+7" },
  BOARD_TAB_EIGHT: { name: "Go to board tab eight", keys: "ctrl+alt+8" },
  BOARD_TAB_LAST: { name: "Go to rightmost board tab", keys: "ctrl+alt+9" },

  // === Mode Switching ===
  PLAY_BOARD: { name: "Play", keys: "mod+1" },
  ANALYZE_BOARD: { name: "Analyze", keys: "mod+2" },
  IMPORT_BOARD: { name: "Import", keys: "mod+3" },
  TRAIN_BOARD: { name: "Train", keys: "mod+4" },

  // === Move Navigation ===
  NEXT_MOVE: { name: "Next move", keys: "arrowright" },
  PREVIOUS_MOVE: { name: "Previous move", keys: "arrowleft" },
  GO_TO_BRANCH_START: { name: "Go to start of branch", keys: "arrowup" },
  GO_TO_BRANCH_END: { name: "Go to end of branch", keys: "arrowdown" },
  GO_TO_START: { name: "Go to start of game", keys: "shift+arrowup" },
  GO_TO_END: { name: "Go to end of game", keys: "shift+arrowdown" },
  NEXT_BRANCHING: { name: "Next branching point", keys: "shift+arrowright" },
  PREVIOUS_BRANCHING: { name: "Previous branching point", keys: "shift+arrowleft" },
  NEXT_BRANCH: { name: "Next branch", keys: "n" },
  PREVIOUS_BRANCH: { name: "Previous branch", keys: "p" },

  // === Annotations ===
  ANNOTATION_BRILLIANT: { name: "Toggle brilliant move annotation", keys: "ctrl+1" },
  ANNOTATION_GOOD: { name: "Toggle good move annotation", keys: "ctrl+2" },
  ANNOTATION_INTERESTING: { name: "Toggle interesting move annotation", keys: "ctrl+3" },
  ANNOTATION_DUBIOUS: { name: "Toggle dubious move annotation", keys: "ctrl+4" },
  ANNOTATION_MISTAKE: { name: "Toggle mistake move annotation", keys: "ctrl+5" },
  ANNOTATION_BLUNDER: { name: "Toggle blunder move annotation", keys: "ctrl+6" },

  DELETE_MOVE: { name: "Delete move", keys: "delete" },

  // === Views ===
  PRACTICE_TAB: { name: "Go to practice tab", keys: "shift+p" },
  ANALYSIS_TAB: { name: "Go to analysis tab", keys: "shift+a" },
  DATABASE_TAB: { name: "Go to database tab", keys: "shift+b" },
  ANNOTATE_TAB: { name: "Go to annotate tab", keys: "shift+d" },
  INFO_TAB: { name: "Go to info tab", keys: "shift+i" },

  // === Toggles / Tools ===
  TOGGLE_EVAL_BAR: { name: "Toggle Eval Bar and Arrows", keys: "e" },
  TOGGLE_ALL_ENGINES: { name: "Toggle all engines", keys: "shift+e" },
  TOGGLE_BLUR: { name: "Toggle blur", keys: "mod+shift+b" },

  SWAP_ORIENTATION: { name: "Swap orientation", keys: "f" },
  CLEAR_SHAPES: { name: "Clear shapes", keys: "mod+l" },

  // === Game Browsing ===
  PREVIOUS_GAME: { name: "Previous game", keys: "pageup" },
  NEXT_GAME: { name: "Next game", keys: "pagedown" },
};

export const keyMapAtom = atomWithStorage("keybindings", keys, defaultStorage(keys, localStorage));

function defaultStorage<T>(keys: T, storage: SyncStringStorage): SyncStorage<T> {
  return {
    getItem(key, initialValue) {
      const storedValue = storage.getItem(key);
      if (storedValue === null) {
        return initialValue;
      }
      const parsed = JSON.parse(storedValue);
      for (const key in keys) {
        if (!(key in parsed)) {
          parsed[key] = keys[key];
        }
      }
      return parsed;
    },
    setItem(key, value) {
      storage.setItem(key, JSON.stringify(value));
    },
    removeItem(key) {
      storage.removeItem(key);
    },
  };
}
