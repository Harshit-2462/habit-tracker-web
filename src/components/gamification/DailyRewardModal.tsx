import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { NeonButton } from '../common/NeonButton';
import { Gift, Sparkles } from 'lucide-react';
import { useGamification } from '../../contexts/GamificationContext';

interface DailyRewardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DailyRewardModal: React.FC<DailyRewardModalProps> = ({ isOpen, onClose }) => {
  const { awardCustomXp } = useGamification();
  const [claimed, setClaimed] = useState(false);

  const handleClaim = () => {
    setClaimed(true);
    awardCustomXp(100, 50); // 100 XP, 50 Coins
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="🎁 BatKitty Daily Mystery Chest" maxWidth="sm">
      <div className="flex flex-col items-center text-center py-4 space-y-4">
        <div className="relative p-6 rounded-3xl bg-gradient-to-br from-[#FF69B4]/30 via-[#F4D03F]/20 to-[#9B51E0]/30 border border-[#FF69B4]/50 shadow-[0_0_30px_rgba(255,105,180,0.4)] animate-bounce">
          <Gift className="w-16 h-16 text-[#F4D03F]" />
          <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-[#FF69B4] animate-spin" />
        </div>

        <h4 className="text-lg font-bold text-white font-mono">
          {claimed ? '🎉 Reward Claimed!' : 'Daily Hero Reward Ready'}
        </h4>

        <p className="text-xs text-slate-300">
          {claimed
            ? 'You unlocked +100 XP and +50 Bat Kitty Coins! Keep your daily habits shining!'
            : 'Open your daily supply crate for bonus XP & Bat-Belt coins!'}
        </p>

        {!claimed ? (
          <NeonButton variant="yellow" size="md" onClick={handleClaim}>
            Claim Crate (+100 XP, +50 Coins)
          </NeonButton>
        ) : (
          <NeonButton variant="pink" size="md" onClick={onClose}>
            Awesome! Back to Dashboard
          </NeonButton>
        )}
      </div>
    </Modal>
  );
};
