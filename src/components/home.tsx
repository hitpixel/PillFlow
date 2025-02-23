import React, { useState, useEffect } from "react";
import CustomerSearch from "./CustomerSearch";
import WebsterPackList from "./WebsterPackList";
import StatusDashboard from "./StatusDashboard";
import { database } from "../lib/database";
import Navbar from "./Navbar";

interface Customer {
  id: string;
  name: string;
  dob: string;
  address: string;
  activeWebsterPacks: number;
}

interface WebsterPack {
  id: string;
  customerName: string;
  dueDate: string;
  status: "pending" | "completed";
}

const Home = () => {
  const [selectedCustomers, setSelectedCustomers] = useState<Customer[]>([]);
  const [scanHistory, setScanHistory] = useState<
    Array<{
      id: string;
      customerName: string;
      barcode: string;
      collectionDate: Date;
      nextDueDate: Date;
      staffInitials: string;
    }>
  >([]);

  // Load scan history on mount
  useEffect(() => {
    const loadScanHistory = async () => {
      try {
        const scans = await database.scans.getAll();
        setScanHistory(
          scans.map((scan) => ({
            id: scan.id,
            customerName: scan.customers?.name || "Unknown",
            barcode: scan.barcode,
            collectionDate: new Date(scan.collection_date),
            nextDueDate: new Date(scan.next_due_date),
            staffInitials: scan.staff_initials,
          })),
        );
      } catch (err) {
        console.error("Failed to load scan history:", err);
      }
    };

    loadScanHistory();
  }, []);

  const handleCustomerSelect = (customers: Customer[]) => {
    setSelectedCustomers(customers);
  };

  const handleBarcodeScan = async (barcodeWithInitials: string) => {
    try {
      const [barcode, staffInitials, weeksSupply] =
        barcodeWithInitials.split("|");
      if (selectedCustomers.length === 0) return;

      const weeks = parseInt(weeksSupply) || 1;
      const nextDueDate = new Date();
      nextDueDate.setDate(nextDueDate.getDate() + weeks * 7);

      const scan = await database.scans.create({
        customer_id: selectedCustomers[0].id,
        barcode,
        staff_initials: staffInitials,
        weeks_supply: weeks,
        collection_date: new Date().toISOString(),
        next_due_date: nextDueDate.toISOString(),
      });

      setScanHistory((prev) => [
        {
          id: scan.id,
          customerName: selectedCustomers[0].name,
          barcode: scan.barcode,
          collectionDate: new Date(scan.collection_date),
          nextDueDate: new Date(scan.next_due_date),
          staffInitials: scan.staff_initials,
        },
        ...prev,
      ]);
    } catch (err) {
      console.error("Failed to save scan:", err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="p-6 space-y-6">
        <div className="max-w-[1512px] mx-auto space-y-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Webster Pack Management
          </h1>

          <CustomerSearch
            onCustomerSelect={handleCustomerSelect}
            selectedCustomers={selectedCustomers}
            scanHistory={scanHistory}
          />

          {selectedCustomers.length > 0 && (
            <div className="space-y-6">
              <StatusDashboard scanHistory={scanHistory} />
              <WebsterPackList
                onScan={handleBarcodeScan}
                selectedCustomer={selectedCustomers[0]?.name}
                scanHistory={scanHistory}
              />
            </div>
          )}

          {selectedCustomers.length === 0 && (
            <div className="flex items-center justify-center h-[400px] bg-white rounded-lg border border-dashed border-gray-300">
              <div className="text-center text-gray-500">
                <p className="text-lg">
                  Select a customer to view webster packs
                </p>
                <p className="text-sm">
                  Use the search above to find a customer
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
