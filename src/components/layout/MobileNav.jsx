import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Compass, Library, Heart } from 'lucide-react';

export function MobileNav() {
  const items = [
    { label: 'Home', path: '/', icon: Home },
    { label: 'Explore', path: '/explore', icon: Compass },
    { label: 'Library', path: '/library', icon: Library },
    { label: 'Favourites', path: '/favorites', icon: Heart },
  ];

  return (
    <nav className="md:hidden flex items-center justify-around h-16 bg-surface-charcoal/95 backdrop-blur-xl border-t border-surface-border z-30 shrink-0 select-none px-2 shadow-2xl">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center gap-1 px-3 py-1.5 rounded-2xl transition-all duration-200 ${
                isActive
                  ? 'text-brand-300 font-bold bg-brand-500/10 shadow-glow-purple scale-105'
                  : 'text-slate-400 hover:text-slate-200'
              }`
            }
          >
            <Icon className="w-5 h-5" />
            <span className="text-[10px] tracking-tight">{item.label}</span>
          </NavLink>
        );
      })}
    </nav>
  );
}
