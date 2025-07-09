"use client"

import { Line, LineChart, CartesianGrid, XAxis, Tooltip } from "recharts"
import {
  ChartContainer,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

const chartData = [
  { month: "Jan", score: 670 },
  { month: "Feb", score: 675 },
  { month: "Mar", score: 680 },
  { month: "Apr", score: 695 },
  { month: "May", score: 705 },
  { month: "Jun", score: 720 },
]

const chartConfig = {
  score: {
    label: "Credit Score",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig

export function CreditScoreChart() {
  return (
    <div className="h-60 w-full">
        <ChartContainer config={chartConfig} className="h-full w-full">
            <LineChart
                accessibilityLayer
                data={chartData}
                margin={{
                left: 12,
                right: 12,
                top: 5,
                bottom: 5
                }}
            >
                <CartesianGrid vertical={false} />
                <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => value.slice(0, 3)}
                />
                <Tooltip
                cursor={false}
                content={<ChartTooltipContent indicator="dot" />}
                />
                <Line
                dataKey="score"
                type="monotone"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                dot={{
                    fill: "hsl(var(--primary))",
                }}
                activeDot={{
                    r: 6,
                }}
                />
            </LineChart>
        </ChartContainer>
    </div>
  )
}
