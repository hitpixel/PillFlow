import React, { useState, useEffect } from "react";
import CustomerSearch from "./CustomerSearch";
import WebsterPackList from "./WebsterPackList";
import StatusOverview from "./StatusOverview";
import { database } from "../lib/database";
import Navbar from "./Navbar";
import CustomerNotes from "./CustomerNotes";
import { useAuth } from "./auth/AuthProvider";
import { usePageTitle } from "../hooks/usePageTitle";

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
  usePageTitle("Home");
  const { user } = useAuth();
  const [selectedCustomers, setSelectedCustomers] = useState<Customer[]>([]);
  const [profile, setProfile] = useState<{ first_name: string } | null>(null);
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

  // Load user profile
  useEffect(() => {
    const loadProfile = async () => {
      if (user) {
        try {
          const profileData = await database.profiles.get(user.id);
          setProfile(profileData);
        } catch (err) {
          console.error("Failed to load profile:", err);
        }
      }
    };
    loadProfile();
  }, [user]);

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

  // Get greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="p-6 space-y-6">
        <div className="max-w-[1512px] mx-auto space-y-6">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold text-gray-900">Home</h1>
            <p className="text-gray-500">
              {getGreeting()}, {profile?.first_name || "there"} 👋
            </p>
          </div>

          <CustomerSearch
            onCustomerSelect={handleCustomerSelect}
            selectedCustomers={selectedCustomers}
            scanHistory={scanHistory}
          />

          {selectedCustomers.length > 0 && (
            <div className="space-y-6">
              <StatusOverview scanHistory={scanHistory} />
              <div className="flex gap-6">
                <div className="flex-[3]">
                  <WebsterPackList
                    onScan={handleBarcodeScan}
                    selectedCustomer={selectedCustomers[0]?.name}
                    scanHistory={scanHistory}
                  />
                </div>
                <div className="flex-1">
                  <CustomerNotes customerId={selectedCustomers[0]?.id} />
                </div>
              </div>
            </div>
          )}

          {selectedCustomers.length === 0 && (
            <div className="flex items-center justify-center h-[400px] bg-white rounded-lg border border-dashed border-gray-300">
              <div className="text-center text-gray-500">
                <p className="text-lg">
                  Select a customer to view medication packs
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
