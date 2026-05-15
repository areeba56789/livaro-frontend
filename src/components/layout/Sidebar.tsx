'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LineChart, Briefcase, History, BrainCircuit } from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { name: 'New Analysis', href: '/dashboard', icon: LineChart },
    { name: 'My Portfolio', href: '/dashboard/portfolio', icon: Briefcase },
    { name: 'AI History', href: '/dashboard/history', icon: History },
  ];

  return (
    <aside className="w-64 h-full bg-neutral-950/80 backdrop-blur-2xl border-r border-white/10 flex flex-col z-40 relative">
      <div className="p-6 flex items-center gap-3 border-b border-white/5">
        <BrainCircuit className="w-6 h-6 text-teal-400" />
        <span className="text-xl font-light tracking-tight text-white">Livaro</span>
      </div>

      <nav className="flex-1 py-6 px-4 flex flex-col gap-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                isActive 
                  ? 'bg-white/10 text-white shadow-[inset_0_0_15px_rgba(255,255,255,0.05)]' 
                  : 'text-white/50 hover:bg-white/5 hover:text-white/80'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium text-sm tracking-wide">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-6 text-xs text-white/30 tracking-widest uppercase font-semibold">
        Version 1.0.0
      </div>
    </aside>
  );
}
