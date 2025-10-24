
import React from 'react';
import { LoveMasterIcon } from './Icons';

const Header: React.FC = () => {
  return (
    <header className="bg-slate-900/50 backdrop-blur-sm p-4 border-b border-slate-700/50 flex items-center justify-center space-x-4 shadow-lg">
      <LoveMasterIcon className="w-10 h-10 text-pink-400" />
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-rose-500">
          恋愛マスターAI
        </h1>
        <p className="text-xs text-slate-400">Your Personal AI Love Consultant</p>
      </div>
    </header>
  );
};

export default Header;
