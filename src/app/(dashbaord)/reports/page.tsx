'use client';

import { useQuery } from '@tanstack/react-query';
import * as React from 'react';
import { Label, Pie, PieChart } from 'recharts';
import { queryKeys } from '~/app/Context/QueryKeys';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs';

import { StatusCodes } from 'http-status-codes';
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '~/components/ui/chart';
import { Progress } from '~/components/ui/progress';
import { Statistics } from '../actions';

type StatType = {
  category: string;
  spending: number;
  percentage: number;
};
const chartData = [
  { browser: 'chrome', visitors: 275, fill: 'var(--color-chrome)' },
  { browser: 'safari', visitors: 200, fill: 'var(--color-safari)' },
  { browser: 'firefox', visitors: 287, fill: 'var(--color-firefox)' },
  { browser: 'edge', visitors: 173, fill: 'var(--color-edge)' },
  { browser: 'other', visitors: 190, fill: 'var(--color-other)' },
];

const chartConfig = {
  visitors: {
    label: 'Visitors',
  },
  chrome: {
    label: 'Chrome',
    color: 'hsl(var(--chart-1))',
  },
  safari: {
    label: 'Safari',
    color: 'hsl(var(--chart-2))',
  },
  firefox: {
    label: 'Firefox',
    color: 'hsl(var(--chart-3))',
  },
  edge: {
    label: 'Edge',
    color: 'hsl(var(--chart-4))',
  },
  other: {
    label: 'Other',
    color: 'hsl(var(--chart-5))',
  },
} satisfies ChartConfig;

export default function Report() {
  const [incomeStat, setIncomeStat] = React.useState<StatType[]>();
  const [expenseStat, setExpenseStat] = React.useState<StatType[]>();
  const [totalValue, setTotalValue] = React.useState({
    income: 0,
    expense: 0,
  });

  useQuery({
    queryKey: [queryKeys.categoryWiseStatistic],
    queryFn: async () => {
      const resp = await Statistics.categoryWise();
      if (resp.status !== StatusCodes.OK) {
        return [];
      }
      setIncomeStat(resp.data?.income);
      setExpenseStat(resp.data?.expenses);
      setTotalValue({
        income: resp.data?.totalIncome ?? 0,
        expense: resp.data?.totalExpense ?? 0,
      });
      return resp.data;
    },
  });

  return (
    <div className="p-2">
      <Tabs defaultValue="expenses" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="expenses">Expenses</TabsTrigger>
          <TabsTrigger value="income">Income</TabsTrigger>
        </TabsList>
        <TabsContent value="expenses">
          <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square max-h-[240px]"
          >
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Pie
                data={chartData}
                dataKey="visitors"
                nameKey="browser"
                innerRadius={60}
                strokeWidth={5}
              >
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                      return (
                        <text
                          x={viewBox.cx}
                          y={viewBox.cy}
                          textAnchor="middle"
                          dominantBaseline="middle"
                        >
                          <tspan
                            x={viewBox.cx}
                            y={viewBox.cy}
                            className="fill-foreground text-2xl font-bold"
                          >
                            {totalValue.expense.toLocaleString()}
                          </tspan>
                        </text>
                      );
                    }
                  }}
                />
              </Pie>
            </PieChart>
          </ChartContainer>
          <div className="space-y-3">
            {expenseStat?.map(item => (
              <div
                key={item.category}
                className="grid grid-cols-[100px_1fr] items-start gap-2"
              >
                <p className="capitalize text-primary">{item.category}</p>
                <Progress value={item.percentage} />
              </div>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="income">
          <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square max-h-[240px]"
          >
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Pie
                data={chartData}
                dataKey="visitors"
                nameKey="browser"
                innerRadius={60}
                strokeWidth={5}
              >
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                      return (
                        <text
                          x={viewBox.cx}
                          y={viewBox.cy}
                          textAnchor="middle"
                          dominantBaseline="middle"
                        >
                          <tspan
                            x={viewBox.cx}
                            y={viewBox.cy}
                            className="fill-foreground text-2xl font-bold"
                          >
                            {totalValue.income.toLocaleString()}
                          </tspan>
                        </text>
                      );
                    }
                  }}
                />
              </Pie>
            </PieChart>
          </ChartContainer>
          <div className="space-y-3">
            {incomeStat?.map(item => (
              <div
                key={item.category}
                className="grid grid-cols-[100px_1fr] items-start gap-2"
              >
                <p className="capitalize text-primary">{item.category}</p>
                <Progress value={item.percentage} />
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
