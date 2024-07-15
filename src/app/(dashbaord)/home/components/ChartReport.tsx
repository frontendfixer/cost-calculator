'use client';

import { Bar, BarChart } from 'recharts';
import { Card, CardContent, CardHeader } from '~/components/ui/card';

import { type ChartConfig, ChartContainer } from '~/components/ui/chart';

const ChartReport = () => {
  const chartData = [
    { month: 'January', desktop: 186, mobile: 80 },
    { month: 'February', desktop: 305, mobile: 200 },
    { month: 'March', desktop: 237, mobile: 120 },
    { month: 'April', desktop: 73, mobile: 190 },
    { month: 'May', desktop: 209, mobile: 130 },
    { month: 'June', desktop: 214, mobile: 140 },
  ];
  const chartConfig = {
    desktop: {
      label: 'Desktop',
      color: '#2563eb',
    },
    mobile: {
      label: 'Mobile',
      color: '#60a5fa',
    },
  } satisfies ChartConfig;

  return (
    <Card className="w-full p-0">
      <CardHeader className="border-b px-2 py-3 text-base font-bold">
        Spending Report
      </CardHeader>
      <CardContent className="pt-3">
        <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
          <BarChart accessibilityLayer data={chartData}>
            <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
            <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default ChartReport;
