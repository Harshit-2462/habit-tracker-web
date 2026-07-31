import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { NeonButton } from '../common/NeonButton';
import { Gift, Sparkles, Clock, CheckCircle2 } from 'lucide-react';
import { useGamification } from '../../contexts/GamificationContext';
import { useAuth } from '../../contexts/AuthContext';
import { getTodayFormatted } from '../../utils/dateUtils';

interface DailyRewardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const isRewardClaimedToday = (userId?: string): boolean => {
  const effectiveId = userId || 'demo-user-123';
  const today = getTodayFormatted();
  const lastClaimDate = localStorage.getItem(`batkitty_last_crate_claim_${effectiveId}`);
  return lastClaimDate === today;
};

export const DailyRewardModal: React.FC<DailyRewardModalProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const { awardCustomXp } = useGamification();
  const [alreadyClaimed, setAlreadyClaimed] = useState(false);
  const [justClaimed, setJustClaimed] = useState(false);

  const userId = user?.id || 'demo-user-123';

  useEffect(() => {
    if (isOpen) {
      setAlreadyClaimed(isRewardClaimedToday(userId));
      setJustClaimed(false);
    }
  }, [isOpen, userId]);

  const handleClaim = () => {
    const today = getTodayFormatted();
    localStorage.setItem(`batkitty_last_crate_claim_${userId}`, today);
    setJustClaimed(true);
    setAlreadyClaimed(true);
    awardCustomXp(100, 50); // 100 XP, 50 Coins
    window.dispatchEvent(new Event('batkitty_crate_claimed'));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="🎁 BatKitty Daily Mystery Chest" maxWidth="sm">
      <div className="flex flex-col items-center text-center py-4 space-y-4">
        <div className={`relative p-6 rounded-3xl border transition-all ${
          alreadyClaimed && !justClaimed
            ? 'bg-white/5 border-white/10 opacity-75'
            : 'bg-gradient-to-br from-[#FF69B4]/30 via-[#F4D03F]/20 to-[#9B51E0]/30 border-[#FF69B4]/50 shadow-[0_0_30px_rgba(255,105,180,0.4)] animate-bounce'
        }`}>
          <Gift className={`w-16 h-16 ${alreadyClaimed && !justClaimed ? 'text-slate-400' : 'text-[#F4D03F]'}`} />
          {(!alreadyClaimed || justClaimed) && (
            <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-[#FF69B4] animate-spin" />
          )}
        </div>

        <h4 className="text-lg font-bold text-white font-mono">
          {justClaimed
            ? '🎉 Reward Claimed!'
            : alreadyClaimed
            ? '⏳ Crate Claimed For Today'
            : 'Daily Hero Supply Crate Ready'}
        </h4>

        <p className="text-xs text-slate-300 leading-relaxed max-w-xs">
          {justClaimed
            ? 'Awesome! You unlocked +100 XP and +50 Bat Kitty Coins! Keep your daily habits shining!'
            : alreadyClaimed
            ? 'You have already claimed today’s mystery crate! Your next daily reward crate will unlock tomorrow (after 24 hours).'
            : 'Open your daily supply crate for bonus XP & Bat-Belt coins! (Available once per day)'}
        </p>

        {alreadyClaimed && !justClaimed && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#F4D03F]/10 border border-[#F4D03F]/30 text-[#F4D03F] text-xs font-mono font-bold">
            <Clock className="w-3.5 h-3.5" />
            <span>Next Gift Ready Tomorrow</span>
          </div>
        )}

        {!alreadyClaimed ? (
          <NeonButton variant="yellow" size="md" onClick={handleClaim}>
            Claim Daily Crate (+100 XP, +50 Coins)
          </NeonButton>
        ) : (
          <NeonButton variant="pink" size="md" onClick={onClose} icon={<CheckCircle2 className="w-4 h-4" />}>
            Back to Dashboard
          </NeonButton>
        )}
      </div>
    </Modal>
  );
};
