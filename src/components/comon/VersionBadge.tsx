// src/components/common/VersionBadge.tsx
import React, { useState } from 'react';
import { Info, GitBranch, Calendar, Code } from 'lucide-react';
import { getFormattedVersion, VERSION_INFO } from '@/utils/version';


interface VersionBadgeProps {
  variant?: 'minimal' | 'detailed' | 'tooltip';
  className?: string;
}

const VersionBadge: React.FC<VersionBadgeProps> = ({ 
  variant = 'minimal',
  className = '' 
}) => {
  const [showDetails, setShowDetails] = useState(false);

  if (variant === 'minimal') {
    return (
      <div className={`inline-flex items-center gap-2 ${className}`}>
        <Code size={12} className="text-slate-600" />
        <span className="text-[9px] font-mono font-bold text-slate-600 uppercase tracking-wider">
          {getFormattedVersion()}
        </span>
      </div>
    );
  }

  if (variant === 'detailed') {
    return (
      <div className={`bg-slate-900/30 border border-slate-800/50 rounded-xl p-3 ${className}`}>
        <div className="flex items-center gap-2 mb-2">
          <Info size={14} className="text-indigo-500" />
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
            Información del Sistema
          </span>
        </div>
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <GitBranch size={12} className="text-slate-600" />
            <span className="text-[10px] font-mono text-slate-500">
              Versión: <span className="text-indigo-400 font-bold">{VERSION_INFO.version}</span>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Code size={12} className="text-slate-600" />
            <span className="text-[10px] font-mono text-slate-500">
              Entorno: <span className="text-emerald-400 font-bold uppercase">{VERSION_INFO.environment}</span>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar size={12} className="text-slate-600" />
            <span className="text-[10px] font-mono text-slate-500">
              Build: <span className="text-slate-400">{new Date(VERSION_INFO.buildDate).toLocaleDateString('es-ES')}</span>
            </span>
          </div>
        </div>
      </div>
    );
  }

  // variant === 'tooltip'
  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setShowDetails(!showDetails)}
        className="inline-flex items-center gap-2 bg-slate-900/30 hover:bg-slate-900/50 border border-slate-800/50 rounded-lg px-3 py-1.5 transition-all group"
      >
        <Code size={12} className="text-slate-600 group-hover:text-indigo-500 transition-colors" />
        <span className="text-[9px] font-mono font-bold text-slate-600 group-hover:text-slate-400 uppercase tracking-wider transition-colors">
          {getFormattedVersion()}
        </span>
        <Info size={10} className="text-slate-700 group-hover:text-slate-500 transition-colors" />
      </button>

      {showDetails && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40"
            onClick={() => setShowDetails(false)}
          />
          
          {/* Tooltip */}
          <div className="absolute bottom-full right-0 mb-2 z-50 animate-in fade-in slide-in-from-bottom-2 duration-200">
            <div className="bg-slate-900 border border-slate-700 rounded-xl p-4 shadow-2xl min-w-[250px]">
              <div className="flex items-center gap-2 mb-3 pb-3 border-b border-slate-800">
                <Info size={14} className="text-indigo-500" />
                <span className="text-[10px] font-black uppercase tracking-widest text-white">
                  {VERSION_INFO.name}
                </span>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] text-slate-500">Versión:</span>
                  <span className="text-[10px] font-mono font-bold text-indigo-400">
                    {VERSION_INFO.version}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-[10px] text-slate-500">Entorno:</span>
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase ${
                    VERSION_INFO.environment === 'production' 
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                      : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                  }`}>
                    {VERSION_INFO.environment}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-[10px] text-slate-500">Build:</span>
                  <span className="text-[10px] font-mono text-slate-400">
                    {new Date(VERSION_INFO.buildDate).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </span>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-slate-800">
                <p className="text-[9px] text-slate-600 text-center">
                  © 2024 Morton Desarrollos
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default VersionBadge;