import * as React from "react";
import { CalendarDays, Clock } from "lucide-react";

type ActivityType = "match" | "training" | "social" | "other";

export interface Activity {
  id: string;
  title: string;
  type: ActivityType;
  startsAt?: string;     // ISO string (preferred)
  date?: string;         // Fallback for existing data
  time?: string;         // Fallback for existing data
  coverUrl?: string;
  location?: string;
}

const typeStyles: Record<ActivityType, { pill: string; ring: string }> = {
  match:    { pill: "bg-violet-600 text-white",  ring: "ring-violet-400/50" },
  training: { pill: "bg-emerald-600 text-white", ring: "ring-emerald-400/50" },
  social:   { pill: "bg-amber-600 text-white",   ring: "ring-amber-400/50" },
  other:    { pill: "bg-slate-600 text-white",   ring: "ring-slate-400/50" },
};

function parseDateTime(activity: Activity) {
  // Handle both new startsAt format and legacy date/time format
  if (activity.startsAt) {
    return new Date(activity.startsAt);
  } else if (activity.date && activity.time) {
    // Convert legacy format: "Dec 15, 2024" + "15:00" to Date
    const dateStr = `${activity.date} ${activity.time}`;
    return new Date(dateStr);
  }
  return new Date(); // fallback
}

function fmtParts(activity: Activity, locale = typeof navigator !== "undefined" ? navigator.language : "da-DK") {
  const d = parseDateTime(activity);
  const time = d.toLocaleTimeString(locale, { hour12: false, hour: "2-digit", minute: "2-digit" });
  const weekday = d.toLocaleDateString(locale, { weekday: "short" });
  const date = d.toLocaleDateString(locale, { day: "2-digit", month: "short" });
  return { time, weekday, date };
}

export function ActivityBannerCard({
  activity,
  onClick,
}: {
  activity: Activity;
  onClick?: () => void;
}) {
  const { pill, ring } = typeStyles[activity.type] ?? typeStyles.other;
  const { time, weekday, date } = fmtParts(activity);

  return (
    <article
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick?.();
        }
      }}
      className={`group cursor-pointer overflow-hidden rounded-3xl bg-card ring-1 ${ring} shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-primary transition-all duration-200 hover:shadow-md hover:ring-2`}
    >
      <div className="relative aspect-[16/9]">
        {activity.coverUrl ? (
          <img src={activity.coverUrl} alt="" className="absolute inset-0 h-full w-full object-cover" />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" aria-hidden />
        
        {/* Top badges */}
        <div className="absolute left-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-white/90 text-sm font-semibold ring-1 ring-black/5">
          {(activity.title?.[0] || "A").toUpperCase()}
        </div>
        <div className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-white/90 text-sm font-semibold ring-1 ring-black/5">
          {activity.type[0].toUpperCase()}
        </div>
        
        {/* Bottom overlay content */}
        <div className="absolute left-4 bottom-4 space-y-2">
          <h3 className="line-clamp-1 text-2xl font-bold text-white drop-shadow-sm">{activity.title}</h3>
          <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${pill}`}>
            {activity.type.toUpperCase()}
          </span>
        </div>
      </div>
      
      {/* Bottom info rail */}
      <div className="flex items-center justify-between px-4 py-3 text-sm text-muted-foreground">
        <div className="inline-flex items-center gap-2">
          <Clock className="h-4 w-4" aria-hidden />
          <span className="tabular-nums">{time}</span>
        </div>
        <div className="inline-flex items-center gap-2">
          <CalendarDays className="h-4 w-4" aria-hidden />
          <span>
            {weekday}. <span className="tabular-nums">{date}</span>
          </span>
        </div>
      </div>
    </article>
  );
}

export function ActivityBannerSkeleton() {
  return (
    <div className="animate-pulse overflow-hidden rounded-3xl ring-1 ring-border">
      <div className="aspect-[16/9] bg-muted" />
      <div className="h-12 bg-muted/50" />
    </div>
  );
}