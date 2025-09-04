// components/task-stats.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Clock, ListTodo } from "lucide-react";
import type { TaskStats } from "@/types/TaskState/model";
import Link from "next/link";
import type { ComponentType } from "react";

interface StatsProps {
  stats: TaskStats;
}

export function StatsCards({ stats }: StatsProps) {
  // ——— คำนวณให้เห็นชัด ———
  const total = Math.max(0, stats?.total ?? 0);
  const pending = Math.max(0, stats?.pending ?? 0);
  const done = Math.max(0, stats?.done ?? 0);

  const pct = (n: number) => (total ? Math.round((n / total) * 100) : 0);
  const pendingPct = pct(pending);
  const donePct = pct(done);

  type StatItem = {
    title: string;
    value: number;
    percent?: number;
    icon: ComponentType<{ className?: string }>;
    tone: {
      ring: string;
      text: string;
      icon: string;
      gradientCard: string;
      gradientBar: string;
      badgeBg: string;
      badgeText: string;
    };
    href: string;
    footer?: string;
  };

  const items: StatItem[] = [
    {
      title: "Total Tasks",
      value: total,
      icon: ListTodo,
      tone: {
        ring: "ring-blue-400/60",
        text: "text-blue-700 dark:text-blue-200",
        icon: "text-blue-500",
        gradientCard: "from-blue-400/35 via-blue-300/20 to-blue-200/10",
        gradientBar: "from-blue-500 to-blue-300",
        badgeBg: "bg-blue-500/15",
        badgeText: "text-blue-400",
      },
      href: "/tasks",
    },
    {
      title: "Pending",
      value: pending,
      percent: pendingPct,
      icon: Clock,
      tone: {
        ring: "ring-orange-400/60",
        text: "text-orange-700 dark:text-orange-200",
        icon: "text-orange-500",
        gradientCard: "from-orange-400/35 via-orange-300/20 to-orange-200/10",
        gradientBar: "from-orange-500 to-orange-300",
        badgeBg: "bg-orange-500/15",
        badgeText: "text-orange-400",
      },
      href: "/tasks?status=pending",
      footer: `${pendingPct}% pending`,
    },
    {
      title: "Solved",
      value: done,
      percent: donePct,
      icon: CheckCircle,
      tone: {
        ring: "ring-green-400/60",
        text: "text-green-700 dark:text-green-200",
        icon: "text-green-500",
        gradientCard: "from-green-400/35 via-green-300/20 to-green-200/10",
        gradientBar: "from-green-500 to-green-300",
        badgeBg: "bg-green-500/15",
        badgeText: "text-green-400",
      },
      href: "/tasks?status=done",
      footer: `${donePct}% solved`,
    },
  ];

  return (
    // ✅ equal height: ให้ grid ยืด item เต็มแทร็ค + ให้ลูก h-full
    <div className="grid grid-cols-1 gap-5 px-1 lg:grid-cols-3 items-stretch">
      {items.map((it) => {
        const Icon = it.icon;
        const widthPct = it.title === "Total Tasks" ? 100 : (it.percent ?? 0);

        return (
          <Link
            key={it.title}
            href={it.href}
            aria-label={`Open ${it.title}`}
            className="block h-full focus:outline-none"     // ⬅️ สำคัญ
            prefetch
          >
            <Card
              className={[
                "group relative h-full flex flex-col",       // ⬅️ สำคัญ
                "overflow-hidden rounded-2xl border-l-4 bg-gradient-to-br",
                it.tone.gradientCard,
                "ring-1", it.tone.ring,
                "shadow-sm backdrop-blur-sm transition-all duration-300 ease-in-out",
                "hover:shadow-lg hover:scale-[1.02] hover:-translate-y-0.5",
                "focus-within:ring-2",
                // ถ้าอยาก “ล็อกความสูงคงที่” ให้เปิดบรรทัดข้างล่างนี้แทน
                // "min-h-[180px] sm:min-h-[190px] lg:min-h-[200px]"
              ].join(" ")}
            >
              {/* overlay นุ่มๆ */}
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(transparent,rgba(255,255,255,0.06))] dark:bg-[radial-gradient(transparent,rgba(0,0,0,0.25))]" />

              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-md font-medium text-muted-foreground transition-colors group-hover:text-foreground">
                  {it.title}
                </CardTitle>
                <div
                  className={[
                    "p-2 rounded-full bg-white/20 dark:bg-black/20",
                    "transition-transform duration-200 group-hover:scale-110",
                    it.tone.icon, "ring-1", it.tone.ring,
                  ].join(" ")}
                >
                  <Icon className="h-4 w-4" />
                </div>
              </CardHeader>

              {/* flex-1 ทำให้ส่วนเนื้อหาขยายตัวเพื่อบาลานซ์ความสูงทุกใบ */}
              <CardContent className="flex-1 pb-4 flex flex-col">
                {/* ค่า + badge */}
                <div className="flex items-center justify-between gap-2">
                  <div className={["text-5xl font-bold leading-none tracking-tight", "transition-transform duration-200 group-hover:scale-[1.03]", it.tone.text].join(" ")}>
                    {it.value}
                  </div>
                  {typeof it.percent === "number" && (
                    <span className={["inline-flex items-center rounded-full px-2 py-0.5 text-sm font-medium", it.tone.badgeBg, it.tone.badgeText, "ring-1 ring-inset", it.tone.ring].join(" ")}>
                      {it.percent}%
                    </span>
                  )}
                </div>

                {/* progress bar */}
                <div
                  className="mt-3 h-2 w-full overflow-hidden rounded-full bg-muted/50 border border-b-slate-950"
                  role="progressbar"
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={widthPct}
                >
                  <div
                    className={["h-full bg-gradient-to-r", it.tone.gradientBar].join(" ")}
                    style={{ width: `${widthPct}%`, transition: "width 500ms ease" }}
                  />
                </div>
              </CardContent>

              {/* corner glow */}
              <span
                aria-hidden
                className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full blur-xl bg-white/20 dark:bg-white/10"
              />
            </Card>
          </Link>
        );
      })}
    </div>
  );
}
