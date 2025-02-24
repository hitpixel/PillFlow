import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { startOfWeek, endOfWeek, isWithinInterval } from "date-fns";

export interface DashboardStats {
  totalPatients: number;
  totalCollections: number;
  collectionRate: number;
  dueThisWeek: number;
  scans: Array<{
    collection_date: string;
  }>;
  loading: boolean;
  error: string | null;
}

export const useDashboardStats = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalPatients: 0,
    totalCollections: 0,
    collectionRate: 0,
    dueThisWeek: 0,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Get total active patients (customers)
        const { data: customers, error: patientsError } = await supabase
          .from("customers")
          .select("*");

        if (patientsError) throw patientsError;

        const totalPatients = customers?.length || 0;

        // Get all webster pack scans with customer info
        const { data: scans, error: scansError } = await supabase.from(
          "webster_pack_scans",
        ).select(`
            *,
            customers (name)
          `);

        if (scansError) throw scansError;

        // Calculate total collections (total packs collected)
        const totalCollections = scans?.length || 0;

        // Calculate collection rate (collections completed on time)
        const onTimeCollections =
          scans?.filter((scan) => {
            const collectionDate = new Date(scan.collection_date);
            const dueDate = new Date(scan.next_due_date);
            return collectionDate <= dueDate;
          }).length || 0;

        const collectionRate =
          totalCollections > 0
            ? (onTimeCollections / totalCollections) * 100
            : 0;

        // Calculate packs due this week
        const weekStart = startOfWeek(new Date());
        const weekEnd = endOfWeek(new Date());

        const dueThisWeek =
          scans?.filter((scan) => {
            const dueDate = new Date(scan.next_due_date);
            return isWithinInterval(dueDate, {
              start: weekStart,
              end: weekEnd,
            });
          }).length || 0;

        setStats({
          totalPatients: totalPatients || 0,
          totalCollections,
          collectionRate: Math.round(collectionRate * 10) / 10, // Round to 1 decimal
          dueThisWeek,
          scans: scans || [],
          loading: false,
          error: null,
        });
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        setStats((prev) => ({
          ...prev,
          loading: false,
          error: "Failed to load dashboard statistics",
        }));
      }
    };

    fetchStats();
  }, []);

  return stats;
};
