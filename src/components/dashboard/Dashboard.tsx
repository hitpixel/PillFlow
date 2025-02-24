import React from "react";
import { Card } from "../ui/card";
import { usePageTitle } from "@/hooks/usePageTitle";
import Navbar from "../Navbar";
import { BarChart, Activity, Users, Calendar } from "lucide-react";

const Dashboard = () => {
  usePageTitle("Dashboard");

  const stats = [
    {
      title: "Total Collections",
      value: "1,234",
      change: "+12.3%",
      icon: BarChart,
      color: "blue",
    },
    {
      title: "Active Customers",
      value: "456",
      change: "+5.2%",
      icon: Users,
      color: "green",
    },
    {
      title: "Due Today",
      value: "23",
      change: "-2.1%",
      icon: Calendar,
      color: "orange",
    },
    {
      title: "Collection Rate",
      value: "98.2%",
      change: "+1.1%",
      icon: Activity,
      color: "purple",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="p-6 space-y-6">
        <div className="max-w-[1512px] mx-auto space-y-6">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-500">
              Overview of your pharmacy's performance
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <Card key={stat.title} className="p-6">
                  <div className="flex items-center justify-between">
                    <div className={`p-2 bg-${stat.color}-100 rounded-lg`}>
                      <Icon className={`h-5 w-5 text-${stat.color}-600`} />
                    </div>
                    <span
                      className={`text-sm font-medium ${stat.change.startsWith("+") ? "text-green-600" : "text-red-600"}`}
                    >
                      {stat.change}
                    </span>
                  </div>
                  <div className="mt-4">
                    <h3 className="text-sm font-medium text-gray-500">
                      {stat.title}
                    </h3>
                    <p className="text-2xl font-semibold text-gray-900">
                      {stat.value}
                    </p>
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Placeholder for charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="p-6 h-[400px]">
              <h3 className="text-lg font-semibold mb-4">
                Collections Over Time
              </h3>
              <div className="flex items-center justify-center h-full text-gray-500">
                Chart placeholder
              </div>
            </Card>
            <Card className="p-6 h-[400px]">
              <h3 className="text-lg font-semibold mb-4">Customer Activity</h3>
              <div className="flex items-center justify-center h-full text-gray-500">
                Chart placeholder
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
