import React from "react";
import { Card } from "./ui/card";
import { Checkbox } from "./ui/checkbox";
import { ScrollArea } from "./ui/scroll-area";
import { Badge } from "./ui/badge";
import { format } from "date-fns";

interface ScanHistoryItem {
  id: string;
  barcode: string;
  timestamp: Date;
  packType: string;
}

interface PackChecklistProps {
  customerId?: string;
  customerName?: string;
  scanHistory?: ScanHistoryItem[];
}

const defaultHistory: ScanHistoryItem[] = [
  {
    id: "1",
    barcode: "WP123456",
    timestamp: new Date("2024-03-20T08:00:00"),
    packType: "Morning Pack",
  },
  {
    id: "2",
    barcode: "WP123457",
    timestamp: new Date("2024-03-19T14:30:00"),
    packType: "Evening Pack",
  },
  {
    id: "3",
    barcode: "WP123458",
    timestamp: new Date("2024-03-18T20:15:00"),
    packType: "Night Pack",
  },
];

const PackChecklist: React.FC<PackChecklistProps> = ({
  customerName = "Customer",
  scanHistory = defaultHistory,
}) => {
  return (
    <Card className="w-full max-w-[800px] h-[500px] bg-white p-6">
      <div className="flex flex-col h-full">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">
              Scan History
            </h2>
            <p className="text-sm text-gray-500">{customerName}</p>
          </div>
          <Badge variant="outline" className="px-3 py-1">
            {scanHistory.length} Scans
          </Badge>
        </div>

        <ScrollArea className="flex-1">
          <div className="space-y-4">
            {scanHistory
              .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
              .map((scan) => (
                <div
                  key={scan.id}
                  className="flex items-center justify-between p-4 rounded-lg border border-gray-200 bg-white"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-900">
                        {scan.packType}
                      </span>
                      <Badge variant="secondary" className="text-xs">
                        {scan.barcode}
                      </Badge>
                    </div>
                    <span className="text-sm text-gray-500">
                      {format(scan.timestamp, "MMM d, yyyy h:mm a")}
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </ScrollArea>

        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            Showing all webster pack scans in chronological order
          </p>
        </div>
      </div>
    </Card>
  );
};

export default PackChecklist;
