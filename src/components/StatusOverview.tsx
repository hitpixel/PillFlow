import React from "react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Clock, CheckCircle2 } from "lucide-react";
import { format, isFuture } from "date-fns";

interface ScanHistory {
  id: string;
  customerName: string;
  barcode: string;
  collectionDate: Date;
  nextDueDate: Date;
  staffInitials: string;
}

interface StatusOverviewProps {
  scanHistory?: ScanHistory[];
  selectedCustomer?: string;
}

const StatusOverview = ({
  scanHistory = [],
  selectedCustomer,
}: StatusOverviewProps) => {
  // Filter scans for selected customer
  const customerScans = scanHistory.filter(
    (scan) => !selectedCustomer || scan.customerName === selectedCustomer,
  );
  const lastCollection =
    customerScans.length > 0
      ? customerScans.reduce((latest, scan) =>
          scan.collectionDate > latest.collectionDate ? scan : latest,
        ).collectionDate
      : null;

  const upcomingDue =
    customerScans.length > 0
      ? customerScans.reduce((earliest, scan) =>
          scan.nextDueDate < earliest.nextDueDate ? scan : earliest,
        ).nextDueDate
      : null;

  const pendingCount = customerScans.filter((scan) =>
    isFuture(scan.nextDueDate),
  ).length;

  return (
    <div className="w-full h-[120px] bg-white">
      <div className="grid grid-cols-2 gap-4 p-4 h-full">
        <Card className="p-4 flex items-center justify-between bg-orange-50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 rounded-full">
              <Clock className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <h3 className="font-semibold text-orange-900">Next Due</h3>
              <p className="text-sm text-orange-700">
                {upcomingDue
                  ? format(upcomingDue, "MMM d, yyyy")
                  : "No packs due"}
              </p>
            </div>
          </div>
          <Badge variant="secondary" className="bg-orange-100 text-orange-700">
            {pendingCount}
          </Badge>
        </Card>

        <Card className="p-4 flex items-center justify-between bg-blue-50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-full">
              <CheckCircle2 className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-blue-900">Last Collection</h3>
              <p className="text-sm text-blue-700">
                {lastCollection
                  ? format(lastCollection, "MMM d, yyyy")
                  : "No collections yet"}
              </p>
            </div>
          </div>
          <Badge variant="secondary" className="bg-blue-100 text-blue-700">
            {scanHistory.length}
          </Badge>
        </Card>
      </div>
    </div>
  );
};

export default StatusOverview;
