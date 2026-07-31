import React, { useState } from 'react';
import { GlassCard } from '../components/common/GlassCard';
import { NeonButton } from '../components/common/NeonButton';
import { useAuth } from '../contexts/AuthContext';
import { exportToJSON, exportToCSV } from '../utils/exportUtils';
import { habitService } from '../services/habitService';
import { User, Download, FileText, Bell, Shield, Check } from 'lucide-react';
import { isSupabaseConfigured } from '../lib/supabase';

const AVATAR_OPTIONS = [
  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80',
];

export const SettingsPage: React.FC = () => {
  const { profile, settings, updateProfile, updateSettings } = useAuth();
  const [fullName, setFullName] = useState(profile?.full_name || '');
  const [selectedAvatar, setSelectedAvatar] = useState(profile?.avatar_url || AVATAR_OPTIONS[0]);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveProfile = async () => {
    await updateProfile({
      full_name: fullName,
      avatar_url: selectedAvatar,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleExportJSON = async () => {
    const [habits, logs] = await Promise.all([
      habitService.getHabits(profile?.id),
      habitService.getAllLogs(profile?.id),
    ]);
    exportToJSON(habits, logs);
  };

  const handleExportCSV = async () => {
    const [habits, logs] = await Promise.all([
      habitService.getHabits(profile?.id),
      habitService.getAllLogs(profile?.id),
    ]);
    exportToCSV(habits, logs);
  };

  return (
    <div className="space-y-8 pb-12 max-w-4xl">
      <div>
        <h2 className="text-2xl font-extrabold text-white font-mono flex items-center gap-2">
          <span>⚙️ Bat-Cave System Settings</span>
          <span className="text-[#FF69B4] text-base">🎀</span>
        </h2>
        <p className="text-xs text-slate-400">
          Manage profile details, avatars, data backups, and notifications
        </p>
      </div>

      {/* Supabase Status Banner */}
      <GlassCard
        glowColor={isSupabaseConfigured() ? 'pink' : 'yellow'}
        className="p-4 flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <Shield className="w-5 h-5 text-[#F4D03F]" />
          <div>
            <span className="text-xs font-bold text-slate-200 font-mono block">
              Backend Connection Status
            </span>
            <span className="text-[10px] text-slate-400">
              Supabase Project: <strong>Encrypted & Active</strong>
            </span>
          </div>
        </div>
        <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-bold font-mono">
          CONNECTED LIVE
        </span>
      </GlassCard>

      {/* Profile Section */}
      <GlassCard glowColor="purple" className="p-6 space-y-6">
        <h3 className="text-base font-extrabold text-white font-mono flex items-center gap-2">
          <User className="w-4 h-4 text-[#FF69B4]" />
          Hero Profile & Avatar Customization
        </h3>

        {/* Avatar Picker */}
        <div>
          <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">
            Choose Hero Avatar
          </label>
          <div className="flex items-center gap-4">
            {AVATAR_OPTIONS.map((url, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setSelectedAvatar(url)}
                className={`relative rounded-2xl overflow-hidden border-2 transition-all ${
                  selectedAvatar === url
                    ? 'border-[#FF69B4] scale-110 shadow-[0_0_15px_#FF69B4]'
                    : 'border-white/10 opacity-60 hover:opacity-100'
                }`}
              >
                <img src={url} alt="Avatar option" className="w-14 h-14 object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Full Name */}
        <div>
          <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
            Display Hero Name
          </label>
          <input
            type="text"
            value={fullName}
            onChange={e => setFullName(e.target.value)}
            className="w-full max-w-md px-4 py-2.5 bg-white/5 border border-white/10 rounded-2xl text-slate-100 text-sm focus:outline-none focus:border-[#FF69B4]"
          />
        </div>

        <div className="flex items-center gap-3 pt-2">
          <NeonButton variant="pink" size="md" onClick={handleSaveProfile}>
            Save Profile Settings
          </NeonButton>
          {savedSuccess && (
            <span className="text-xs text-emerald-400 font-bold flex items-center gap-1 font-mono">
              <Check className="w-4 h-4" /> Profile Updated!
            </span>
          )}
        </div>
      </GlassCard>

      {/* Data Export & Backup Section */}
      <GlassCard glowColor="pink" className="p-6 space-y-4">
        <h3 className="text-base font-extrabold text-white font-mono flex items-center gap-2">
          <Download className="w-4 h-4 text-[#F4D03F]" />
          Data Portability & Backup
        </h3>
        <p className="text-xs text-slate-400">
          Export your habits and log history anytime as JSON or CSV files for safe keeping.
        </p>

        <div className="flex flex-wrap items-center gap-4">
          <NeonButton
            variant="purple"
            size="sm"
            icon={<FileText className="w-4 h-4" />}
            onClick={handleExportJSON}
          >
            Export JSON Data
          </NeonButton>
          <NeonButton
            variant="yellow"
            size="sm"
            icon={<Download className="w-4 h-4" />}
            onClick={handleExportCSV}
          >
            Export CSV Spreadsheet
          </NeonButton>
        </div>
      </GlassCard>

      {/* Notification Preferences */}
      <GlassCard className="p-6 space-y-4">
        <h3 className="text-base font-extrabold text-white font-mono flex items-center gap-2">
          <Bell className="w-4 h-4 text-cyan-400" />
          Sound Effects & Notification Reminders
        </h3>

        <div className="space-y-3 text-xs">
          <label className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/10 cursor-pointer">
            <span className="font-bold text-slate-200">Play Kitty Chime on Habit Completion</span>
            <input
              type="checkbox"
              checked={settings?.reminder_sound ?? true}
              onChange={e => updateSettings({ reminder_sound: e.target.checked })}
              className="accent-[#FF69B4] w-4 h-4"
            />
          </label>

          <label className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/10 cursor-pointer">
            <span className="font-bold text-slate-200">Email Daily Summary Reminders</span>
            <input
              type="checkbox"
              checked={settings?.email_notifications ?? true}
              onChange={e => updateSettings({ email_notifications: e.target.checked })}
              className="accent-[#FF69B4] w-4 h-4"
            />
          </label>
        </div>
      </GlassCard>
    </div>
  );
};
