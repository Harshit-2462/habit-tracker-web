import React from 'react';
import { Modal } from '../common/Modal';
import { Command } from 'lucide-react';

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const KeyboardShortcutsModal: React.FC<KeyboardShortcutsModalProps> = ({ isOpen, onClose }) => {
  const shortcuts = [
    { key: 'N', action: 'Create New Habit' },
    { key: 'D', action: 'Navigate to Dashboard' },
    { key: 'H', action: 'Navigate to Habits List' },
    { key: 'C', action: 'Navigate to Calendar' },
    { key: 'A', action: 'Navigate to Analytics' },
    { key: 'S', action: 'Navigate to Settings' },
    { key: '/', action: 'Focus Search Bar' },
    { key: 'ESC', action: 'Close any active Modal' },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="⌨️ Bat-Belt Keyboard Shortcuts" maxWidth="md">
      <div className="space-y-3 py-2">
        <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
          <Command className="w-4 h-4 text-[#FF69B4]" />
          <span>Speed up your hero habit workflow with single key triggers:</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {shortcuts.map(s => (
            <div
              key={s.key}
              className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/10"
            >
              <span className="text-xs text-slate-300 font-medium">{s.action}</span>
              <kbd className="px-2 py-1 rounded-lg bg-[#FF69B4]/20 border border-[#FF69B4]/40 text-[#FF69B4] text-xs font-mono font-bold">
                {s.key}
              </kbd>
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
};
