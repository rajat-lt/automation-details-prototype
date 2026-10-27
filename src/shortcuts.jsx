// Keyboard shortcuts [proposed]. The page now has seven of them, and
// ux-persona.md asks that every power-user shortcut has a visible twin that
// beginners can find; NN/g heuristic 10 asks for help in context. Opened from
// More actions or with "?". LTModal at 480px (guidelines/ltmodal.md).
import React from 'react'
import { LTTable } from './lt.jsx'
import { LTModal } from './overlays.jsx'
import { isMac } from './playback.js'

// Keys joined by "+", alternatives written as "or X".
const Keys = ({ keys }) => (
  <span className="kbd-row">
    {keys.map((k, i) => {
      const alt = k.startsWith('or ')
      return (
        <React.Fragment key={i}>
          {i > 0 && <span className="kbd-join">{alt ? 'or' : '+'}</span>}
          <kbd>{alt ? k.slice(3) : k}</kbd>
        </React.Fragment>
      )
    })}
  </span>
)

export const SHORTCUTS = [
  [['/'], 'Search commands'],
  [['Space'], 'Bring the next failed command into view'],
  [['Shift', 'Space'], 'Bring the previous failed command into view'],
  [['↑', 'or ↓'], 'Previous or next command, once a command has focus'],
  [['Home', 'or End'], 'First or last command'],
  [['Enter'], "Show or hide the focused command's details"],
  [['Shift', 'F10'], 'Menu of the focused command or tab'],
  [['S'], 'Copy the link to this test'],
  [['R'], "Reset the Network tab's timeline strip"],
  [[isMac ? '⌘' : 'Ctrl', 'scroll'], 'Seek the video, over the video or the timeline'],
  [[isMac ? '⌘' : 'Ctrl', 'Enter'], 'Save the comment you are writing'],
  [['?'], 'Show these shortcuts'],
]

export function ShortcutsDialog({ isOpen, onClose }) {
  return (
    <LTModal isOpen={isOpen} title="Keyboard shortcuts" onClose={onClose} extraStyle={{ width: 480 }}>
      <LTTable caption="Keyboard shortcuts"
        columns={[{ key: 'keys', title: 'Shortcut' }, { key: 'action', title: 'Action' }]}
        data={SHORTCUTS.map(([keys, action]) => ({ keys: <Keys keys={keys} />, action }))} />
    </LTModal>
  )
}
