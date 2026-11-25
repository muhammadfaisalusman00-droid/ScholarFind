import React from 'react';
import { Link } from 'react-router-dom';
import { Play } from 'lucide-react';

export const Header: React.FC = () => (
  <header className="sticky top-0 z-50 border-b border-neutral-800 bg-black">
    <div className="mx-auto flex h-14 w-full max-w-[1536px] items-center px-3 sm:px-5 lg:px-8">
      <Link to="/" id="header-logo-link" className="inline-flex items-center gap-2 text-white">
        <span className="flex h-8 w-8 items-center justify-center rounded-md bg-white text-neutral-950">
          <Play className="h-4 w-4 fill-current" />
        </span>
        <span className="text-base font-black tracking-tight">VIDERA</span>
      </Link>
    </div>
  </header>
);


