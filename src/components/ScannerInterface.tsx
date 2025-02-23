import React, { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Camera, X, Check } from "lucide-react";

interface ScannerInterfaceProps {
  onScan?: (barcode: string) => void;
  isScanning?: boolean;
  error?: string;
}

const ScannerInterface = ({
  onScan = (barcode: string) => console.log("Scanned:", barcode),
  isScanning = false,
  error = "",
}: ScannerInterfaceProps) => {
  const [manualCode, setManualCode] = useState("");
  const [showCamera, setShowCamera] = useState(false);
  const [staffInitials, setStaffInitials] = useState("");
  const [weeksSupply, setWeeksSupply] = useState("1");

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualCode && staffInitials && weeksSupply) {
      onScan(`${manualCode}|${staffInitials}|${weeksSupply}`);
      setManualCode("");
      setStaffInitials("");
      setWeeksSupply("1");
    }
  };

  return (
    <Card className="w-[500px] h-[400px] p-6 bg-white">
      <div className="flex flex-col h-full gap-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Webster Pack Scanner</h2>
          {showCamera && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowCamera(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        {showCamera ? (
          <div className="flex-1 bg-slate-100 rounded-lg relative">
            {/* Camera View Placeholder */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-slate-500">
                <Camera className="h-12 w-12 mx-auto mb-2" />
                <p>Camera feed would appear here</p>
              </div>
            </div>

            {isScanning && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
                <div className="animate-pulse bg-green-500 text-white px-4 py-2 rounded-full">
                  Scanning...
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex-1 flex flex-col justify-center gap-6">
            <Button
              className="w-full py-8 text-lg"
              onClick={() => setShowCamera(true)}
            >
              <Camera className="mr-2 h-6 w-6" />
              Start Scanning
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-slate-300" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-slate-500">Or</span>
              </div>
            </div>

            <form onSubmit={handleManualSubmit} className="space-y-4">
              <Input
                type="text"
                placeholder="Staff Initials (required)"
                value={staffInitials}
                onChange={(e) => setStaffInitials(e.target.value.toUpperCase())}
                className="w-full"
                maxLength={3}
                required
              />
              <div className="space-y-4">
                <Input
                  type="text"
                  placeholder="Enter barcode manually"
                  value={manualCode}
                  onChange={(e) => setManualCode(e.target.value)}
                  className="w-full"
                />
                <select
                  value={weeksSupply}
                  onChange={(e) => setWeeksSupply(e.target.value)}
                  className="w-full rounded-md border border-input bg-background px-3 py-2"
                  required
                >
                  <option value="1">1 Week Supply</option>
                  <option value="2">2 Weeks Supply</option>
                  <option value="3">3 Weeks Supply</option>
                  <option value="4">4 Weeks Supply</option>
                </select>
              </div>
              <Button type="submit" className="w-full" disabled={!manualCode}>
                <Check className="mr-2 h-4 w-4" />
                Submit Code
              </Button>
            </form>
          </div>
        )}

        {error && (
          <div className="text-red-500 text-sm text-center">{error}</div>
        )}
      </div>
    </Card>
  );
};

export default ScannerInterface;
