import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { format } from "date-fns";
import { Card } from "../ui/card";

interface CollectionsGraphProps {
  data: Array<{
    collection_date: string;
  }>;
}

const CollectionsGraph = ({ data = [] }: CollectionsGraphProps) => {
  // Process data to get daily collections
  const processedData = React.useMemo(() => {
    const dailyCollections = data.reduce(
      (acc, scan) => {
        const date = format(new Date(scan.collection_date), "yyyy-MM-dd");
        acc[date] = (acc[date] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    return Object.entries(dailyCollections)
      .map(([date, collections]) => ({
        date,
        collections,
      }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }, [data]);

  return (
    <Card className="p-6 h-[400px]">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold">Collections Over Time</h3>
      </div>

      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={processedData}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorCollections" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="date"
              tickFormatter={(date) => format(new Date(date), "MMM d")}
              stroke="#64748b"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#64748b"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => value.toFixed(0)}
            />
            <Tooltip
              labelFormatter={(date) => format(new Date(date), "MMMM d, yyyy")}
              formatter={(value: number) => [value, "Collections"]}
              contentStyle={{
                backgroundColor: "#ffffff",
                border: "1px solid #e2e8f0",
                borderRadius: "6px",
                padding: "8px",
              }}
            />
            <Area
              type="monotone"
              dataKey="collections"
              stroke="#3b82f6"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorCollections)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default CollectionsGraph;
