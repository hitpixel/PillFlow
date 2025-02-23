import React, { useState } from "react";
import { Card } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import { Badge } from "./ui/badge";
import { Scan, List, Search } from "lucide-react";
import { Input } from "./ui/input";
import ScannerInterface from "./ScannerInterface";
import PackChecklist from "./PackChecklist";
import { format } from "date-fns";

interface ScanHistory {
  id: string;
  customerName: string;
  barcode: string;
  collectionDate: Date;
  nextDueDate: Date;
  staffInitials: string;
}

interface WebsterPackListProps {
  scanHistory?: ScanHistory[];
  onScan?: (barcode: string) => void;
  selectedCustomer?: string;
}

const defaultHistory: ScanHistory[] = [
  {
    id: "wp1",
    customerName: "John Doe",
    barcode: "WP123456",
    staffInitials: "JD",
    collectionDate: new Date("2024-03-20"),
    nextDueDate: new Date("2024-04-03"),
  },
  {
    id: "wp2",
    customerName: "Jane Smith",
    barcode: "WP789012",
    collectionDate: new Date("2024-03-19"),
    nextDueDate: new Date("2024-04-02"),
  },
  {
    id: "wp3",
    customerName: "Bob Johnson",
    barcode: "WP345678",
    collectionDate: new Date("2024-03-18"),
    nextDueDate: new Date("2024-04-01"),
  },
];

const WebsterPackList = ({
  scanHistory = defaultHistory,
  onScan = (barcode: string) => console.log("Scanned:", barcode),
  selectedCustomer,
}: WebsterPackListProps) => {
  const [selectedPack, setSelectedPack] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("scan");
  const [searchQuery, setSearchQuery] = useState("");

  const handlePackSelect = (packId: string) => {
    setSelectedPack(packId);
    setActiveTab("checklist");
  };

  return (
    <Card className="w-full max-w-[1512px] h-[600px] bg-white p-6">
      <div className="flex flex-col h-full gap-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold">Webster Pack Management</h2>
          <Badge variant="secondary">{scanHistory.length} Total Scans</Badge>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
          <TabsList className="grid w-full max-w-[400px] grid-cols-2">
            <TabsTrigger value="scan" className="flex items-center gap-2">
              <Scan className="h-4 w-4" />
              Scanner
            </TabsTrigger>
            <TabsTrigger value="list" className="flex items-center gap-2">
              <List className="h-4 w-4" />
              Scan History
            </TabsTrigger>
          </TabsList>

          <div className="mt-4 flex-1">
            <TabsContent value="scan" className="h-full">
              <div className="flex justify-center">
                <ScannerInterface onScan={onScan} />
              </div>
            </TabsContent>

            <TabsContent value="list" className="h-full">
              <Card className="p-4 border bg-white">
                <div className="mb-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                    <Input
                      placeholder="Search scans..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <ScrollArea className="h-[400px]">
                  <div className="space-y-4">
                    {scanHistory
                      .filter(
                        (scan) =>
                          (!selectedCustomer ||
                            scan.customerName === selectedCustomer) &&
                          (searchQuery === "" ||
                            scan.customerName
                              .toLowerCase()
                              .includes(searchQuery.toLowerCase()) ||
                            scan.barcode
                              .toLowerCase()
                              .includes(searchQuery.toLowerCase())),
                      )
                      .sort(
                        (a, b) =>
                          b.collectionDate.getTime() -
                          a.collectionDate.getTime(),
                      )
                      .map((scan) => (
                        <div
                          key={scan.id}
                          className="p-4 rounded-lg border border-gray-200"
                        >
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h3 className="font-medium">
                                {scan.customerName}
                              </h3>
                              <div className="flex gap-2 mt-1">
                                <Badge variant="secondary">
                                  {scan.barcode}
                                </Badge>
                                <Badge variant="outline">
                                  {scan.staffInitials}
                                </Badge>
                              </div>
                            </div>
                            <div className="text-right text-sm text-gray-500">
                              <div>
                                Collected:{" "}
                                {format(scan.collectionDate, "MMM d, yyyy")}
                              </div>
                              <div>
                                Next Due:{" "}
                                {format(scan.nextDueDate, "MMM d, yyyy")}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </ScrollArea>
              </Card>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </Card>
  );
};

export default WebsterPackList;
