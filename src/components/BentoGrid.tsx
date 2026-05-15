'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import ThreeDProperty from './ThreeDProperty';
import { AnalysisReport } from '@/types/rag';
import { TrendingUp, Activity, DollarSign, BrainCircuit, Search } from 'lucide-react';

interface BentoGridProps {
  data: AnalysisReport | null;
  loading: boolean;
  onSearch: (query: string) => void;
}

export default function BentoGrid({ data, loading, onSearch }: BentoGridProps) {
  const container = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useGSAP(() => {
    if (!loading && data) {
      // Counter animation for metrics
      gsap.to('.metric-value', {
        innerText: (i: number, target: HTMLElement) => target.dataset.val,
        duration: 2,
        snap: { innerText: 1 },
        ease: 'power3.out',
        stagger: 0.1,
      });

      // Animate the why matrix list
      gsap.fromTo(
        '.why-item',
        { opacity: 0, x: -20 },
        { opacity: 1, x: 0, duration: 0.5, stagger: 0.1, ease: 'power2.out' }
      );
    }
  }, [data, loading]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputRef.current?.value) {
      onSearch(inputRef.current.value);
    }
  };

  return (
    <div ref={container} className="relative z-10 w-full max-w-7xl mx-auto min-h-screen p-6 md:p-12 flex flex-col pt-24 pointer-events-none">
      
      {/* Search Bar - Make it interactive and ensure it stays on top */}
      <div className="absolute top-6 left-1/2 transform -translate-x-1/2 w-full max-w-xl pointer-events-auto bento-item opacity-0 z-50">
        <form onSubmit={handleSearch} className="relative group">
          <div className="absolute inset-0 bg-teal-500/20 blur-xl rounded-full group-hover:bg-teal-500/30 transition-all duration-500" />
          <div className="relative bg-black/40 backdrop-blur-xl border border-white/10 rounded-full p-2 flex items-center shadow-2xl">
            <Search className="w-5 h-5 text-teal-400 ml-4 mr-2" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Analyze a property or location..."
              className="bg-transparent text-white/90 placeholder-white/40 w-full focus:outline-none px-2 py-1 font-medium tracking-wide"
            />
            <button type="submit" className="bg-teal-500 hover:bg-teal-400 text-white px-6 py-2 rounded-full font-semibold transition-colors shadow-[0_0_15px_rgba(20,184,166,0.5)]">
              Analyze
            </button>
          </div>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1 pointer-events-auto mt-4">
        
        {/* Primary Verdict Card */}
        <div className="md:col-span-2 bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl p-8 flex flex-col relative overflow-hidden bento-item opacity-0 shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
          <div className="flex justify-between items-start mb-6 z-10">
            <div>
              <h2 className="text-teal-400 font-bold tracking-widest text-sm uppercase flex items-center gap-2">
                <BrainCircuit className="w-4 h-4" /> AI Verdict
              </h2>
              <h1 className="text-3xl md:text-4xl font-light text-white mt-2 leading-tight">
                {loading ? "Analyzing vector space..." : (data?.summary || "Awaiting target parameters.")}
              </h1>
            </div>
          </div>
          
          <div className="absolute -right-20 -bottom-20 w-96 h-96 opacity-60">
             <ThreeDProperty isResolving={!loading && !!data} />
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 gap-4 bento-item opacity-0">
          <MetricCard title="Appreciation" icon={<TrendingUp />} value={data?.key_metrics?.predicted_appreciation_pct || 0} suffix="%" />
          <MetricCard title="Rental Yield" icon={<Activity />} value={data?.key_metrics?.estimated_rental_yield_pct || 0} suffix="%" />
          <MetricCard title="Avg Price" icon={<DollarSign />} value={data?.key_metrics?.avg_price_per_sqft || 0} prefix="Rs " suffix="/sqft" />
          <MetricCard title="Sentiment" icon={<BrainCircuit />} value={data?.key_metrics?.sentiment_score_1_to_10 || 0} suffix="/10" />
        </div>

        {/* Why Matrix */}
        <div className="md:col-span-3 bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl p-8 bento-item opacity-0 shadow-[0_8px_32px_rgba(0,0,0,0.3)] flex flex-col">
           <h3 className="text-white/60 font-medium uppercase tracking-widest text-xs mb-6">The 'Why' Matrix Ledger</h3>
           <div className="max-h-[300px] overflow-y-auto space-y-4 pr-4 custom-scrollbar">
             {loading ? (
               <div className="flex space-x-2 items-center h-full">
                 <div className="w-2 h-2 bg-teal-500 rounded-full animate-ping"></div>
                 <span className="text-teal-500/50 font-mono text-sm ml-2">Calculating logic pathways...</span>
               </div>
             ) : data?.why_matrix?.map((item, idx) => (
               <div key={idx} className="why-item flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-xl hover:bg-white/10 transition-colors cursor-pointer group">
                  <span className="text-white/80 font-light tracking-wide">{item.factor}</span>
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent mx-4 group-hover:via-teal-500/50 transition-colors"></div>
                  <span className="text-teal-400 font-mono text-sm">[0x{Math.floor(Math.random()*1000).toString(16).padStart(3, '0')}]</span>
               </div>
             ))}
           </div>
        </div>

      </div>
    </div>
  );
}

function MetricCard({ title, icon, value, prefix = "", suffix = "" }: any) {
  return (
    <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl p-6 flex flex-col justify-between hover:bg-white/10 transition-colors group shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
      <div className="text-white/40 group-hover:text-teal-400 transition-colors">
        {React.cloneElement(icon, { className: 'w-6 h-6' })}
      </div>
      <div className="mt-4">
        <div className="text-white/50 text-xs uppercase tracking-widest font-semibold mb-1">{title}</div>
        <div className="text-2xl xl:text-3xl font-light text-white flex flex-wrap items-baseline gap-x-1">
          {prefix && <span className="text-base xl:text-lg text-white/50">{prefix}</span>}
          <span className="metric-value font-mono truncate max-w-full" data-val={value}>0</span>
          {suffix && <span className="text-base xl:text-lg text-white/50 shrink-0">{suffix}</span>}
        </div>
      </div>
    </div>
  );
}
