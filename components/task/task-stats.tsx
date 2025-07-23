import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Clock, ListTodo } from "lucide-react"
import type { TaskStats } from "@/types/entities"

interface TaskStatsProps {
  stats: TaskStats
}

export function TaskStatsCards({ stats }: TaskStatsProps) {
  const statCards = [
    {
      title: "Total Tasks",
      value: stats.total,
      icon: ListTodo,
      gradient: "from-blue-500/20 via-blue-400/10 to-transparent",
      border: "border-blue-500/50",
      iconColor: "text-blue-500",
      valueColor: "text-blue-600 dark:text-blue-400",
      bgHover: "hover:from-blue-500/30",
    },
    {
      title: "Pending",
      value: stats.pending,
      icon: Clock,
      gradient: "from-orange-500/20 via-orange-400/10 to-transparent",
      border: "border-orange-500/50",
      iconColor: "text-orange-500",
      valueColor: "text-orange-600 dark:text-orange-400",
      bgHover: "hover:from-orange-500/30",
    },
    {
      title: "Solved",
      value: stats.solved,
      icon: CheckCircle,
      gradient: "from-green-500/20 via-green-400/10 to-transparent",
      border: "border-green-500/50",
      iconColor: "text-green-500",
      valueColor: "text-green-600 dark:text-green-400",
      bgHover: "hover:from-green-500/30",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-6 px-4 lg:px-1 @xl/main:grid-cols-3 @5xl/main:grid-cols-3">
      {statCards.map((card) => {
        const IconComponent = card.icon
        return (
          <Card
            key={card.title}
            className={`
              relative overflow-hidden border-l-4 ${card.border}
              bg-gradient-to-br ${card.gradient} ${card.bgHover}
              backdrop-blur-sm transition-all duration-300 ease-in-out
              hover:shadow-lg hover:scale-[1.02] hover:-translate-y-1
              dark:bg-gradient-to-br dark:from-gray-800/50 dark:to-gray-900/30
              group cursor-pointer
            `}
          >
            {/* Subtle background pattern */}
            <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:20px_20px]" />

            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                {card.title}
              </CardTitle>
              <div
                className={`
                p-2 rounded-full bg-white/10 dark:bg-black/10 
                group-hover:scale-110 transition-transform duration-200
                ${card.iconColor}
              `}
              >
                <IconComponent className="h-4 w-4" />
              </div>
            </CardHeader>

            <CardContent className="pb-4">
              <div
                className={`
                text-3xl font-bold tracking-tight ${card.valueColor}
                group-hover:scale-105 transition-transform duration-200
              `}
              >
                {card.value}
              </div>

              {/* Progress indicator bar */}
              <div className="mt-3 h-1 w-full bg-muted rounded-full overflow-hidden">
                <div
                  className={`h-full bg-gradient-to-r ${card.gradient.replace("to-transparent", `to-${card.iconColor.split("-")[1]}-400`)} transition-all duration-500`}
                  style={{
                    width:
                      card.title === "Total Tasks"
                        ? "100%"
                        : card.title === "Pending"
                          ? `${(stats.pending / stats.total) * 100}%`
                          : `${(stats.solved / stats.total) * 100}%`,
                  }}
                />
              </div>

              {/* Percentage text */}
              {card.title !== "Total Tasks" && (
                <div className="mt-2 text-xs text-muted-foreground">
                  {card.title === "Pending"
                    ? `${Math.round((stats.pending / stats.total) * 100)}% pending`
                    : `${Math.round((stats.solved / stats.total) * 100)}% solved`}
                </div>
              )}
            </CardContent>

            {/* Decorative corner accent */}
            <div
              className={`
              absolute top-0 right-0 w-20 h-20 
              bg-gradient-to-bl ${card.gradient} 
              opacity-30 rounded-bl-full
              group-hover:opacity-50 transition-opacity duration-300
            `}
            />
          </Card>
        )
      })}
    </div>
  )
}
