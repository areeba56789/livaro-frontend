'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import ThreeDProperty from './ThreeDProperty';
import { AnalysisReport } from '@/types/rag';
import { TrendingUp, Activity, DollarSign, BrainCircuit } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer, Tooltip, XAxis } from 'recharts';

interface BentoGridProps {
  data: AnalysisReport | null;
  loading: boolean;
}

export default function BentoGrid({ data, loading }: BentoGridProps) {
  const container = useRef<HTMLDivElement>(null);

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

  return (
    <div ref={container} className="relative z-10 w-full max-w-7xl mx-auto min-h-screen p-6 md:p-12 flex flex-col pt-0 pointer-events-none">

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

        {/* Why Matrix & Chart */}
        <div className="md:col-span-3 bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl p-8 bento-item opacity-0 shadow-[0_8px_32px_rgba(0,0,0,0.3)] flex flex-col gap-8 md:flex-row">
           <div className="flex-1 flex flex-col">
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

           <div className="flex-1 flex flex-col min-h-[300px] border-t md:border-t-0 md:border-l border-white/10 pt-8 md:pt-0 md:pl-8">
             <h3 className="text-white/60 font-medium uppercase tracking-widest text-xs mb-6">Price History Projection</h3>
             <div className="flex-1 w-full h-full min-h-[250px]">
               {data?.chart_data ? (
                 <ResponsiveContainer width="100%" height="100%">
                   <AreaChart data={data.chart_data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                     <defs>
                       <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                         <stop offset="5%" stopColor="#2dd4bf" stopOpacity={0.3}/>
                         <stop offset="95%" stopColor="#2dd4bf" stopOpacity={0}/>
                       </linearGradient>
                     </defs>
                     <XAxis dataKey="period" stroke="#ffffff40" fontSize={12} tickLine={false} axisLine={false} />
                     <Tooltip 
                       contentStyle={{ backgroundColor: '#0a0a0a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }}
                       itemStyle={{ color: '#2dd4bf' }}
                     />
                     <Area type="monotone" dataKey="value" stroke="#2dd4bf" strokeWidth={2} fillOpacity={1} fill="url(#colorValue)" />
                   </AreaChart>
                 </ResponsiveContainer>
               ) : (
                 <div className="w-full h-full flex items-center justify-center text-white/20 font-mono text-sm">
                   {loading ? 'Awaiting vectors...' : 'No projection data available'}
                 </div>
               )}
             </div>
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
