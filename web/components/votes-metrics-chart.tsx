'use client';

import { useTheme } from 'next-themes';

import { ThemePrimaryColor } from 'common/utils';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from 'components/core/card';

import { VoteMetrics } from 'models';
import moment from 'moment';
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis } from 'recharts';

interface Props extends React.ComponentProps<typeof Card> {
  data: Array<VoteMetrics>;
}

export const VotesMetricsChart = ({ data, className }: Props) => {
  const { theme: mode } = useTheme();
  const primaryColor = ThemePrimaryColor[mode === 'dark' ? 'dark' : 'light'];

  return (
    <Card className={className}>
      <CardHeader className="pb-0">
        <CardTitle>Voting Distribution</CardTitle>
        <CardDescription>
          Track the distribution of <span className="inline font-semibold">FOR / AGAINST</span> votes.
        </CardDescription>
      </CardHeader>
      <CardContent className="px-3 md:px-6">
        <div className="h-40">
          <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data
              .map((item) => ({
                ...item,
                DATE: moment(item.DATE, 'DD-MM').toDate(), // Convert to JavaScript Date object
              }))
              .sort((a, b) => a.DATE.getTime() - b.DATE.getTime()) // Sort by date
              .map((item) => ({
                ...item,
                DATE: moment(item.DATE).format('MMM DD'), // Format the date as needed
              }))
            }
            >
              <XAxis dataKey="DATE" height={16} className="text-xs text-muted-foreground" />
              <Area
                type="linear"
                dataKey="FOR"
                strokeOpacity={0.4}
                stroke="grey"
                fillOpacity={1}
                fill={`hsl(${primaryColor})`}
              />
              <Area
                type="linear"
                dataKey="AGAINST"
                strokeOpacity={0.25}
                stroke="grey"
                fillOpacity={0.75}
                fill={`hsl(${primaryColor}) / 0.2`}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="rounded-lg border bg-background p-2 shadow-sm">
                        <div className="grid grid-cols-2 gap-2">
                          <div className="flex flex-col">
                            <span className="text-[0.70rem] uppercase text-muted-foreground">For</span>
                            <span className="font-bold">{payload[0].value}</span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[0.70rem] uppercase text-muted-foreground">Against</span>
                            <span className="font-bold text-muted-foreground">{payload[1].value}</span>
                          </div>
                        </div>
                      </div>
                    );
                  }

                  return null;
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
