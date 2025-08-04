"use client";

import { TrendingUp } from "lucide-react";
import {
  RadialBarChart,
  RadialBar,
  PolarRadiusAxis,
  Label,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartConfig,
} from "@/components/ui/chart";

type ChartRadialBudgetProps = {
  income: number;
  expense: number;
  balance: number;
};

const chartConfig = {
  income: {
    label: "Income",
    color: "var(--chart-1)",
  },
  expense: {
    label: "Expense",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

export function ChartRadialBudget({ income, expense, balance }: ChartRadialBudgetProps) {
  const chartData = [
    {
      name: "Budget",
      income,
      expense,
    },
  ];

  return (
    <Card className="flex flex-col bg-zinc-200 border-2xl">
      <CardHeader className="items-center pb-0">
        <CardTitle>&#x1F4B7; Budget Chart</CardTitle>
        <CardDescription>Income vs Expense</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 items-center pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square w-full max-w-[280px]"
        >
          <RadialBarChart
            data={chartData}
            endAngle={180}
            innerRadius={70}
            outerRadius={130}
          >
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <PolarRadiusAxis tick={false} axisLine={false}>
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle">
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) - 16}
                          className="fill-foreground text-2xl font-bold"
                        >
                          £{balance.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 4}
                          className="fill-muted-foreground"
                        >
                          Net Balance
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </PolarRadiusAxis>
            <RadialBar
              dataKey="expense"
              stackId="a"
              fill="oklch(0.79 0 0)"
              cornerRadius={5}
              className="stroke-transparent stroke-2"
            />
            <RadialBar
              dataKey="income"
              stackId="a"
              fill="oklch(0.2 0 0)"
              cornerRadius={5}
              className="stroke-transparent stroke-2"
            />
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          You are saving &#x1F4B0; £{balance.toLocaleString()} <TrendingUp className="h-4 w-4" /> &#x1F911;
        </div>
        <div className="text-muted-foreground leading-none">
          Based on your latest entries
        </div>
      </CardFooter>
    </Card>
  );
}
