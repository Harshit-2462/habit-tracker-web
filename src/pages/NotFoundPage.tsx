import React from 'react';
import { NavLink } from 'react-router-dom';
import { NeonButton } from '../components/common/NeonButton';
import { Home } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center p-6 space-y-4">
      <div className="text-8xl animate-bounce">🦇🎀</div>
      <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#F4D03F] via-[#FF69B4] to-[#9B51E0] font-mono">
        404 — Lost in Gotham City
      </h1>
      <p className="text-sm text-slate-400 max-w-md">
        The Bat Signal couldn't locate this page. It might have been relocated to another corner of the Bat Cave.
      </p>
      <NavLink to="/">
        <NeonButton variant="pink" size="md" icon={<Home className="w-4 h-4" />}>
          Return to Bat Cave Dashboard
        </NeonButton>
      </NavLink>
    </div>
  );
};
