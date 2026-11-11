import React from 'react';

export default function StatCard({
  title,
  value,
  subtext,
  icon: Icon,
  trend,
  trendPositive,
  color = 'teal',
  onClick
}) {
  const colorMap = {
    teal: 'border-teal-500/30 text-primaryTeal bg-primaryTeal/10',
    cyan: 'border-cyan-500/30 text-secondaryCyan bg-secondaryCyan/10',
    red: 'border-red-500/30 text-dangerRed bg-dangerRed/10',
    orange: 'border-orange-500/30 text-warningOrange bg-warningOrange/10',
    green: 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10',
    blue: 'border-blue-500/30 text-blue-400 bg-blue-500/10'
  };

  const currentStyles = colorMap[color] || colorMap.teal;

  return (
    <div
      onClick={onClick}
      className={`bg-cardNavy border border-borderNavy hover:border-slate-600 rounded-xl p-5 transition-all duration-200 shadow-lg ${
        onClick ? 'cursor-pointer hover:scale-[1.01]' : ''
      }`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-slate-400">{title}</p>
          <h3 className="text-2xl font-bold text-white mt-1.5 tracking-tight font-mono">{value}</h3>
        </div>
        {Icon && (
          <div className={`p-2.5 rounded-lg border ${currentStyles}`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      {(subtext || trend) && (
        <div className="mt-3.5 flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-borderNavy/60">
          <span>{subtext}</span>
          {trend && (
            <span
              className={`font-semibold ${
                trendPositive ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              {trend}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
