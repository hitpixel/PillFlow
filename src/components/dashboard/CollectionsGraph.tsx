import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { format, subDays, startOfDay } from "date-fns";
import { Card } from "../ui/card";

interface CollectionsGraphProps {
  data: Array<{
    collection_date: string;
  }>;
}

const CollectionsGraph = ({ data = [] }: CollectionsGraphProps) => {
  // Process data to get daily collections
  const last30Days = Array.from({ length: 30 }, (_, i) => {
    const date = startOfDay(subDays(new Date(), i));
    const collectionsOnDay = data.filter(
      (scan) =>
        startOfDay(new Date(scan.collection_date)).getTime() === date.getTime(),
    ).length;

    return {
      date: date.toISOString(),
      collections: collectionsOnDay,
    };
  }).reverse();

  return (
    <Card className="p-6 h-[400px]">
      <h3 className="text-lg font-semibold mb-4">Collections Over Time</h3>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={last30Days}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorCollections" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            tickFormatter={(date) => format(new Date(date), "MMM d")}
          />
          <YAxis />
          <Tooltip
            labelFormatter={(date) => format(new Date(date), "MMMM d, yyyy")}
            formatter={(value: number) => [value, "Collections"]}
          />
          <Area
            type="monotone"
            dataKey="collections"
            stroke="#3b82f6"
            fillOpacity={1}
            fill="url(#colorCollections)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default CollectionsGraph;
