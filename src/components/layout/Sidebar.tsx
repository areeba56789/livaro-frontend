'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LineChart, Briefcase, History, BrainCircuit, ChevronLeft, ChevronRight } from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navItems = [
    { name: 'New Analysis', href: '/dashboard', icon: LineChart, disabled: false },
    { name: 'My Portfolio', href: '#', icon: Briefcase, disabled: true },
    { name: 'AI History', href: '#', icon: History, disabled: true },
  ];

  const handleNavClick = (e: React.MouseEvent, item: any) => {
    if (item.disabled) {
      e.preventDefault();
      alert('Coming Soon! This feature is still in development.');
    }
  };

  return (
    <aside className={`${isCollapsed ? 'w-20' : 'w-64'} transition-all duration-300 h-full bg-neutral-950/80 backdrop-blur-2xl border-r border-white/10 flex flex-col z-40 relative`}>
      <button 
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-6 bg-neutral-900 border border-white/10 rounded-full p-1 text-white/50 hover:text-white transition-colors z-50"
      >
        {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </button>

      <div className={`p-6 flex items-center gap-3 border-b border-white/5 ${isCollapsed ? 'justify-center px-0' : ''}`}>
        <BrainCircuit className="w-6 h-6 text-teal-400 shrink-0" />
        {!isCollapsed && <span className="text-xl font-light tracking-tight text-white truncate">Livaro</span>}
      </div>

      <nav className={`flex-1 py-6 flex flex-col gap-2 ${isCollapsed ? 'px-2' : 'px-4'}`}>
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={(e) => handleNavClick(e, item)}
              className={`flex items-center gap-3 py-3 rounded-xl transition-all ${isCollapsed ? 'px-0 justify-center' : 'px-4'} ${
                isActive 
                  ? 'bg-white/10 text-white shadow-[inset_0_0_15px_rgba(255,255,255,0.05)]' 
                  : 'text-white/50 hover:bg-white/5 hover:text-white/80'
              }`}
              title={isCollapsed ? item.name : undefined}
            >
              <Icon className="w-5 h-5 shrink-0" />
              {!isCollapsed && <span className="font-medium text-sm tracking-wide truncate">{item.name}</span>}
            </Link>
          );
        })}
      </nav>

      {!isCollapsed && (
        <div className="p-6 text-xs text-white/30 tracking-widest uppercase font-semibold">
          Version 1.0.0
        </div>
      )}
    </aside>
  );
}
