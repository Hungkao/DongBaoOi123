import React from "react";
import { Map, AlertTriangle, Flame, LifeBuoy } from "lucide-react";

const colorStyles = {
  green: {
    container: "bg-emerald-950/40 border-emerald-900",
    title: "text-emerald-300",
    value: "text-emerald-200",
    iconContainer: "bg-emerald-900/30 ring-emerald-800/60",
    iconColor: "text-emerald-300",
  },
  blue: {
    container: "bg-blue-950/40 border-blue-900",
    title: "text-blue-300",
    value: "text-blue-200",
    iconContainer: "bg-blue-900/30 ring-blue-800/60",
    iconColor: "text-blue-300",
  },
  red: {
    container: "bg-red-950/40 border-red-900",
    title: "text-red-300",
    value: "text-red-200",
    iconContainer: "bg-red-900/30 ring-red-800/60",
    iconColor: "text-red-300",
  },
  yellow: {
    container: "bg-yellow-950/30 border-yellow-900",
    title: "text-yellow-300",
    value: "text-yellow-200",
    iconContainer: "bg-yellow-900/30 ring-yellow-800/60",
    iconColor: "text-yellow-300",
  },
  purple: {
    container: "bg-purple-950/40 border-purple-900",
    title: "text-purple-300",
    value: "text-purple-200",
    iconContainer: "bg-purple-900/30 ring-purple-800/60",
    iconColor: "text-purple-300",
  },
  gray: {
    container: "bg-slate-900 border-slate-800",
    title: "text-slate-300",
    value: "text-slate-200",
    iconContainer: "bg-slate-800 ring-slate-700",
    iconColor: "text-slate-300",
  },
};

const iconMap = {
  map: Map,
  "alert-triangle": AlertTriangle,
  flame: Flame,
  "life-buoy": LifeBuoy,
};

function StatsCard({ title, value, subtitle, color = "gray", icon }) {
  const styles = colorStyles[color] || colorStyles.gray;
  const IconComp = icon ? iconMap[icon] : null;

  return (
    <div className={`rounded-2xl shadow-lg border p-4 sm:p-6 ${styles.container}`}>
      <div className="flex items-start gap-3">
        {IconComp && (
          <span className={`inline-flex h-10 w-10 items-center justify-center rounded-lg ring-1 ring-inset ${styles.iconContainer}`}>
            <IconComp className={`${styles.iconColor} h-6 w-6`} />
          </span>
        )}
        <div className="flex-1">
          <div className={`text-xs sm:text-sm font-medium ${styles.title}`}>{title}</div>
          <div className={`mt-1 text-2xl sm:text-3xl font-extrabold tracking-tight ${styles.value}`}>
            {value}
          </div>
          {subtitle && (
            <div className={`mt-1 text-xs ${styles.title}`}>{subtitle}</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default StatsCard;


