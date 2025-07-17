"use client";

import * as React from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const chartData = [
  { date: "2024-07-01", coaching: 120, boosting: 80 },
  { date: "2024-07-02", coaching: 200, boosting: 100 },
  { date: "2024-07-03", coaching: 180, boosting: 130 },
  { date: "2024-07-04", coaching: 240, boosting: 90 },
  { date: "2024-07-05", coaching: 210, boosting: 110 },
  { date: "2024-07-06", coaching: 320, boosting: 150 },
  { date: "2024-07-07", coaching: 290, boosting: 120 },
  { date: "2024-07-08", coaching: 310, boosting: 160 },
  { date: "2024-07-09", coaching: 400, boosting: 190 },
  { date: "2024-07-10", coaching: 350, boosting: 180 },
  { date: "2024-07-11", coaching: 220, boosting: 140 },
  { date: "2024-07-12", coaching: 170, boosting: 120 },
  { date: "2024-07-13", coaching: 260, boosting: 170 },
  { date: "2024-07-14", coaching: 310, boosting: 210 },
];

const chartConfig = {
  coaching: {
    label: "Coaching",
    color: "hsl(var(--chart-1))",
  },
  boosting: {
    label: "Boosting",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export default function Component() {
  const [timeRange, setTimeRange] = React.useState("90d");

  const filteredData = chartData.filter((item) => {
    const date = new Date(item.date);
    const referenceDate = new Date("2024-06-30");
    let daysToSubtract = 90;
    if (timeRange === "30d") {
      daysToSubtract = 30;
    } else if (timeRange === "7d") {
      daysToSubtract = 7;
    }
    const startDate = new Date(referenceDate);
    startDate.setDate(startDate.getDate() - daysToSubtract);
    return date >= startDate;
  });

  return (
    <Card className="bg-black/20 backdrop-blur-sm border-white/10 shadow-2xl">
      <CardHeader className="flex items-center gap-2 space-y-0 border-b border-white/30 py-2 sm:flex-row">
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          <CardTitle className="text-2xl font-bold">Earnings  <span className="pl-1">History</span> </CardTitle>
          {/* <CardDescription>Showing provider earnings over time</CardDescription> */}
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger
            className="w-[160px] rounded-lg sm:ml-auto border-white/60"
            aria-label="Select a value"
          >
            <SelectValue placeholder="Last 3 months" />
          </SelectTrigger>
          <SelectContent className="rounded-xl bg-[#5E1043]">
            <SelectItem value="90d" className="rounded-lg">
              Last 3 months
            </SelectItem>
            <SelectItem value="30d" className="rounded-lg">
              Last 30 days
            </SelectItem>
            <SelectItem value="7d" className="rounded-lg">
              Last 7 days
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[350px] w-full"
        >
          <BarChart data={filteredData}>
            <CartesianGrid vertical={false} stroke="rgba(255, 255, 255, 0.3)" />
            <YAxis
              tickFormatter={(value) => `$${value}`}
              tick={{ fill: "#ffffff", fontSize: 14 }}
              ticks={[0, 50, 100, 150, 200, 250, 300, 350, 400]}
              interval={0}
            />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={{ stroke: "hsl(var(--muted))" }}
              tick={{ fill: "#ffffff", fontSize: 14 }}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) =>
                    new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })
                  }
                  indicator="line"
                  className="bg-[#5E1043]"
                />
              }
            />
            <Bar
              dataKey="coaching"
              fill="#FE0FD0"
              radius={[4, 4, 0, 0]}
              barSize={16}
            />
            <Bar
              dataKey="boosting"
              fill="#58B9E3"
              radius={[4, 4, 0, 0]}
              barSize={16}
            />
            <ChartLegend content={<ChartLegendContent />} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
