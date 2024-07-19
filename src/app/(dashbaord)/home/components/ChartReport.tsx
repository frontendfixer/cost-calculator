'use client';

import { useQuery } from '@tanstack/react-query';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import { Card, CardContent, CardHeader } from '~/components/ui/card';

import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '~/components/ui/chart';
import { Transactions } from '../../actions';
import { StatusCodes } from 'http-status-codes';
import { queryKeys } from '~/app/Context/QueryKeys';

const ChartReport = () => {
  const chartConfig = {
    income: {
      label: 'Income',
      color: '#34d399',
    },
    expense: {
      label: 'Expense',
      color: '#dc2626',
    },
    saving: {
      label: 'Saving',
      color: '#facc15',
    },
  } satisfies ChartConfig;

  const monthWiseData = useQuery({
    queryKey: [queryKeys.monthWiseStatistic],
    queryFn: async () => {
      const resp = await Transactions.monthWiseStat();
      if (resp.status !== StatusCodes.OK) {
        return [];
      } else {
        return resp.data;
      }
    },
  });

  return (
    <Card className="max-w-screen-sm p-0">
      <CardHeader className="border-b px-2 py-3 text-base font-bold">
        Month wise spending Report
      </CardHeader>
      <CardContent className="p-2">
        <ChartContainer config={chartConfig} className="w-full">
          <BarChart accessibilityLayer data={monthWiseData.data}>
            <CartesianGrid vertical={false} />
            <YAxis dataKey="income" type="number" tickMargin={10} />
            <XAxis
              dataKey="month"
              tickMargin={10}
              tickFormatter={(value: string) => value.slice(0, 3)}
              tickLine={false}
            />
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar
              dataKey="income"
              fill="var(--color-income)"
              radius={[2, 2, 0, 0]}
            />
            <Bar
              dataKey="expense"
              fill="var(--color-expense)"
              radius={0}
              stackId="a"
            />
            <Bar
              dataKey="saving"
              fill="var(--color-saving)"
              radius={[2, 2, 0, 0]}
              stackId="a"
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default ChartReport;
