import React from 'react';

export const Footer: React.FC = () => (
  <footer className="border-t border-neutral-900 bg-black py-5">
    <div className="mx-auto w-full max-w-[1536px] px-3 text-center text-xs text-neutral-600 sm:px-5 lg:px-8">
      © {new Date().getFullYear()} VIDERA
    </div>
  </footer>
);

