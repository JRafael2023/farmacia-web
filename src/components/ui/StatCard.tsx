import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  change?: number;
  changeLabel?: string;
  color?: "blue" | "emerald" | "amber" | "rose" | "violet" | "cyan";
  className?: string;
}

const COLOR_CLASSES = {
  blue: { bg: "bg-blue-50", icon: "bg-blue-100 text-blue-600", text: "text-blue-600" },
  emerald: { bg: "bg-emerald-50", icon: "bg-emerald-100 text-emerald-600", text: "text-emerald-600" },
  amber: { bg: "bg-amber-50", icon: "bg-amber-100 text-amber-600", text: "text-amber-600" },
  rose: { bg: "bg-rose-50", icon: "bg-rose-100 text-rose-600", text: "text-rose-600" },
  violet: { bg: "bg-violet-50", icon: "bg-violet-100 text-violet-600", text: "text-violet-600" },
  cyan: { bg: "bg-cyan-50", icon: "bg-cyan-100 text-cyan-600", text: "text-cyan-600" },
};

export default function StatCard({ title, value, icon, change, changeLabel, color = "blue", className }: StatCardProps) {
  const colors = COLOR_CLASSES[color];

  return (
    <div className={cn("bg-white rounded-xl border border-slate-200 p-5 flex items-start gap-4", className)}>
      <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center shrink-0", colors.icon)}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-slate-500 font-medium uppercase tracking-wide truncate">{title}</p>
        <p className="text-2xl font-bold text-slate-800 mt-0.5">{value}</p>
        {change !== undefined && (
          <div className="flex items-center gap-1 mt-1">
            {change > 0 ? (
              <TrendingUp size={12} className="text-emerald-500" />
            ) : change < 0 ? (
              <TrendingDown size={12} className="text-red-500" />
            ) : (
              <Minus size={12} className="text-slate-400" />
            )}
            <span className={cn("text-xs font-medium",
              change > 0 ? "text-emerald-600" : change < 0 ? "text-red-600" : "text-slate-500"
            )}>
              {change > 0 ? "+" : ""}{change}%{changeLabel ? ` ${changeLabel}` : ""}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
