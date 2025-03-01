import React, { useState } from "react";
import { Card } from "../ui/card";
import CollectionsGraph from "./CollectionsGraph";
import { usePageTitle } from "@/hooks/usePageTitle";
import { useDashboardStats } from "@/hooks/useDashboardStats";
import {
  BarChart,
  Activity,
  Users,
  Calendar as CalendarIcon,
  Search,
  Settings,
  Bell,
  Home,
  CreditCard,
  BarChart2,
  User,
  FileText,
  Rocket,
  HelpCircle,
  MoreHorizontal,
  CheckCircle,
  ArrowRight,
  Globe,
  ShoppingCart,
} from "lucide-react";
import { DateRange } from "react-day-picker";
import { format, subDays } from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Input } from "../ui/input";

const Dashboard = () => {
  usePageTitle("Dashboard");
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 30),
    to: new Date(),
  });

  const {
    totalPatients,
    totalCollections,
    collectionRate,
    dueThisWeek,
    scans,
    loading,
    error,
  } = useDashboardStats(dateRange);

  return (
    <div className="flex min-h-screen bg-gradient-to-r from-[#050a26] to-[#1a1f37]">
      {/* Sidebar */}
      <div className="w-64 min-h-screen bg-gradient-to-r from-[#050a26] to-[#1a1f37] p-6 flex flex-col">
        <div className="text-center mb-10">
          <h1 className="text-white text-sm tracking-[2.5px]">
            VISION UI FREE
          </h1>
        </div>

        <div className="flex-1">
          <div className="mb-6">
            <div className="bg-[#1a1f37] rounded-xl p-3 flex items-center space-x-4">
              <div className="w-8 h-8 rounded-xl bg-blue-500 flex items-center justify-center">
                <Home className="h-4 w-4 text-white" />
              </div>
              <span className="text-white text-sm">Dashboard</span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-4 px-3 py-2">
              <div className="w-8 h-8 rounded-xl bg-[#1a1f37] flex items-center justify-center">
                <BarChart2 className="h-4 w-4 text-white" />
              </div>
              <span className="text-white text-sm">Tables</span>
            </div>

            <div className="flex items-center space-x-4 px-3 py-2">
              <div className="w-8 h-8 rounded-xl bg-[#1a1f37] flex items-center justify-center">
                <CreditCard className="h-4 w-4 text-white" />
              </div>
              <span className="text-white text-sm">Billing</span>
            </div>

            <div className="flex items-center space-x-4 px-3 py-2">
              <div className="w-8 h-8 rounded-xl bg-[#1a1f37] flex items-center justify-center">
                <Settings className="h-4 w-4 text-white" />
              </div>
              <span className="text-white text-sm">RTL</span>
            </div>

            <div className="mt-8 mb-4">
              <p className="text-white text-xs px-3">ACCOUNT PAGES</p>
            </div>

            <div className="flex items-center space-x-4 px-3 py-2">
              <div className="w-8 h-8 rounded-xl bg-[#1a1f37] flex items-center justify-center">
                <User className="h-4 w-4 text-white" />
              </div>
              <span className="text-white text-sm">Profile</span>
            </div>

            <div className="flex items-center space-x-4 px-3 py-2">
              <div className="w-8 h-8 rounded-xl bg-[#1a1f37] flex items-center justify-center">
                <FileText className="h-4 w-4 text-white" />
              </div>
              <span className="text-white text-sm">Sign In</span>
            </div>

            <div className="flex items-center space-x-4 px-3 py-2">
              <div className="w-8 h-8 rounded-xl bg-[#1a1f37] flex items-center justify-center">
                <Rocket className="h-4 w-4 text-white" />
              </div>
              <span className="text-white text-sm">Sign Up</span>
            </div>
          </div>
        </div>

        <div className="mt-auto">
          <div className="bg-[#0075ff] rounded-xl p-4 relative overflow-hidden">
            <div className="absolute inset-0 opacity-30 bg-gradient-to-r from-[#4fd1c5] to-[#0075ff]"></div>
            <div className="relative z-10">
              <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center mb-4">
                <HelpCircle className="h-4 w-4 text-blue-500" />
              </div>
              <h3 className="text-white text-sm font-bold mb-1">Need help?</h3>
              <p className="text-white text-xs mb-4">Please check our docs</p>
              <button className="bg-[#090d23] text-white text-xs font-bold py-2 px-4 rounded-xl w-full">
                DOCUMENTATION
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <p className="text-gray-400 text-sm">Pages / Dashboard</p>
            <h1 className="text-white text-sm font-medium">Dashboard</h1>
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="h-4 w-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <Input
                placeholder="Type here..."
                className="bg-[#1a1f37] border-none text-white pl-10 w-64 rounded-xl"
              />
            </div>
            <User className="h-5 w-5 text-gray-400" />
            <Settings className="h-5 w-5 text-gray-400" />
            <Bell className="h-5 w-5 text-gray-400" />
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <Card className="bg-[#1a1f37] border-none text-white p-6">
            <div className="flex justify-between items-center">
              <div className="flex flex-col">
                <p className="text-gray-400 text-xs">Today's Money</p>
                <div className="flex items-center gap-2">
                  <p className="text-lg font-bold">$53,000</p>
                  <span className="text-sm text-green-500">+55%</span>
                </div>
              </div>
              <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center">
                <CreditCard className="h-5 w-5 text-white" />
              </div>
            </div>
          </Card>

          <Card className="bg-[#1a1f37] border-none text-white p-6">
            <div className="flex justify-between items-center">
              <div className="flex flex-col">
                <p className="text-gray-400 text-xs">Today's Users</p>
                <div className="flex items-center gap-2">
                  <p className="text-lg font-bold">2,300</p>
                  <span className="text-sm text-green-500">+5%</span>
                </div>
              </div>
              <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center">
                <Globe className="h-5 w-5 text-white" />
              </div>
            </div>
          </Card>

          <Card className="bg-[#1a1f37] border-none text-white p-6">
            <div className="flex justify-between items-center">
              <div className="flex flex-col">
                <p className="text-gray-400 text-xs">New Clients</p>
                <div className="flex items-center gap-2">
                  <p className="text-lg font-bold">+3,052</p>
                  <span className="text-sm text-red-500">-14%</span>
                </div>
              </div>
              <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center">
                <FileText className="h-5 w-5 text-white" />
              </div>
            </div>
          </Card>

          <Card className="bg-[#1a1f37] border-none text-white p-6">
            <div className="flex justify-between items-center">
              <div className="flex flex-col">
                <p className="text-gray-400 text-xs">Total Sales</p>
                <div className="flex items-center gap-2">
                  <p className="text-lg font-bold">$173,000</p>
                  <span className="text-sm text-green-500">+8%</span>
                </div>
              </div>
              <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center">
                <ShoppingCart className="h-5 w-5 text-white" />
              </div>
            </div>
          </Card>
        </div>

        {/* Main Content Grids */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Welcome Card */}
          <Card className="bg-[#1a1f37] border-none text-white p-6 relative overflow-hidden">
            <div className="relative z-10">
              <p className="text-gray-400 text-sm">Welcome back,</p>
              <h2 className="text-2xl font-bold mb-4">Mark Johnson</h2>
              <p className="text-gray-300 mb-8">
                Glad to see you again!
                <br />
                Ask me anything.
              </p>
              <div className="flex items-center text-sm text-gray-400">
                <span>Tap to record</span>
                <ArrowRight className="h-4 w-4 ml-2" />
              </div>
            </div>
            <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-blue-500/20 to-transparent"></div>
          </Card>

          {/* Satisfaction Card */}
          <Card className="bg-[#1a1f37] border-none text-white p-6">
            <div className="mb-6">
              <h3 className="text-lg font-bold">Satisfaction Rate</h3>
              <p className="text-gray-400 text-sm">From all projects</p>
            </div>

            <div className="flex justify-center items-center mb-6">
              <div className="relative w-32 h-32">
                <div className="absolute inset-0 rounded-full border-4 border-blue-500/30"></div>
                <div className="absolute inset-0 rounded-full border-4 border-blue-500 border-t-transparent transform rotate-[95deg]"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-blue-500 rounded-full p-2">
                    <div className="h-6 w-6 text-white flex items-center justify-center">
                      😊
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-400 text-xs">0%</span>
              <div className="text-center">
                <p className="text-2xl font-bold">95%</p>
                <p className="text-gray-400 text-xs">Based on likes</p>
              </div>
              <span className="text-gray-400 text-xs">100%</span>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Projects Card */}
          <Card className="bg-[#1a1f37] border-none text-white p-6">
            <div className="flex items-center mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-bold">Projects</h3>
                <div className="flex items-center text-gray-400 text-sm">
                  <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                  <span>30 done this month</span>
                </div>
              </div>
              <MoreHorizontal className="h-5 w-5 text-gray-400" />
            </div>

            <div className="mb-4">
              <div className="grid grid-cols-4 text-xs text-gray-400 mb-2">
                <div>COMPANIES</div>
                <div>MEMBERS</div>
                <div>BUDGET</div>
                <div>COMPLETION</div>
              </div>
              <div className="w-full h-px bg-gray-700 mb-4"></div>

              <div className="mb-6">
                <div className="grid grid-cols-4 items-center mb-2">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-xl bg-pink-500 flex items-center justify-center mr-3">
                      <span className="text-white text-xs">XD</span>
                    </div>
                    <span className="text-sm">Chakra Soft UI Version</span>
                  </div>
                  <div className="flex -space-x-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div
                        key={i}
                        className="w-6 h-6 rounded-full bg-gray-600 border-2 border-[#1a1f37]"
                      ></div>
                    ))}
                  </div>
                  <div className="text-sm font-bold">$14,000</div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-bold">60%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-1">
                      <div
                        className="bg-blue-500 h-1 rounded-full"
                        style={{ width: "60%" }}
                      ></div>
                    </div>
                  </div>
                </div>
                <div className="w-full h-px bg-gray-700 my-4"></div>
              </div>

              <div className="mb-6">
                <div className="grid grid-cols-4 items-center mb-2">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-xl bg-blue-500 flex items-center justify-center mr-3">
                      <span className="text-white text-xs">⏱️</span>
                    </div>
                    <span className="text-sm">Add Progress Track</span>
                  </div>
                  <div className="flex -space-x-2">
                    {Array.from({ length: 2 }).map((_, i) => (
                      <div
                        key={i}
                        className="w-6 h-6 rounded-full bg-gray-600 border-2 border-[#1a1f37]"
                      ></div>
                    ))}
                  </div>
                  <div className="text-sm font-bold">$3,000</div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-bold">10%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-1">
                      <div
                        className="bg-blue-500 h-1 rounded-full"
                        style={{ width: "10%" }}
                      ></div>
                    </div>
                  </div>
                </div>
                <div className="w-full h-px bg-gray-700 my-4"></div>
              </div>

              <div className="mb-6">
                <div className="grid grid-cols-4 items-center mb-2">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-xl bg-cyan-500 flex items-center justify-center mr-3">
                      <span className="text-white text-xs">SL</span>
                    </div>
                    <span className="text-sm">Fix Platform Errors</span>
                  </div>
                  <div className="flex -space-x-2">
                    {Array.from({ length: 2 }).map((_, i) => (
                      <div
                        key={i}
                        className="w-6 h-6 rounded-full bg-gray-600 border-2 border-[#1a1f37]"
                      ></div>
                    ))}
                  </div>
                  <div className="text-sm font-bold">Not set</div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-bold">100%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-1">
                      <div
                        className="bg-blue-500 h-1 rounded-full"
                        style={{ width: "100%" }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Orders Overview Card */}
          <Card className="bg-[#1a1f37] border-none text-white p-6">
            <div className="mb-4">
              <h3 className="text-lg font-bold">Orders overview</h3>
              <div className="flex items-center text-gray-400 text-sm">
                <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                <span>+30% this month</span>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex">
                <div className="mr-4">
                  <div className="w-8 h-8 rounded-xl bg-blue-500 flex items-center justify-center">
                    <span className="text-white text-xs">🔔</span>
                  </div>
                  <div className="w-px h-full bg-gray-700 mx-auto mt-2"></div>
                </div>
                <div className="mb-2">
                  <p className="text-sm font-medium">$2400, Design changes</p>
                  <p className="text-xs text-gray-400">22 DEC 7:20 PM</p>
                </div>
              </div>

              <div className="flex">
                <div className="mr-4">
                  <div className="w-8 h-8 rounded-xl bg-blue-500 flex items-center justify-center">
                    <span className="text-white text-xs">CSS</span>
                  </div>
                  <div className="w-px h-full bg-gray-700 mx-auto mt-2"></div>
                </div>
                <div className="mb-2">
                  <p className="text-sm font-medium">New order #4219423</p>
                  <p className="text-xs text-gray-400">21 DEC 11:21 PM</p>
                </div>
              </div>

              <div className="flex">
                <div className="mr-4">
                  <div className="w-8 h-8 rounded-xl bg-blue-500 flex items-center justify-center">
                    <span className="text-white text-xs">🛒</span>
                  </div>
                  <div className="w-px h-full bg-gray-700 mx-auto mt-2"></div>
                </div>
                <div className="mb-2">
                  <p className="text-sm font-medium">
                    Server Payments for April
                  </p>
                  <p className="text-xs text-gray-400">21 DEC 9:28 PM</p>
                </div>
              </div>

              <div className="flex">
                <div className="mr-4">
                  <div className="w-8 h-8 rounded-xl bg-blue-500 flex items-center justify-center">
                    <span className="text-white text-xs">💳</span>
                  </div>
                  <div className="w-px h-full bg-gray-700 mx-auto mt-2"></div>
                </div>
                <div className="mb-2">
                  <p className="text-sm font-medium">
                    New card added for order #3210145
                  </p>
                  <p className="text-xs text-gray-400">20 DEC 3:52 PM</p>
                </div>
              </div>

              <div className="flex">
                <div className="mr-4">
                  <div className="w-8 h-8 rounded-xl bg-blue-500 flex items-center justify-center">
                    <span className="text-white text-xs">⌨️</span>
                  </div>
                  <div className="w-px h-full bg-gray-700 mx-auto mt-2"></div>
                </div>
                <div className="mb-2">
                  <p className="text-sm font-medium">
                    Unlock packages for Development
                  </p>
                  <p className="text-xs text-gray-400">19 DEC 11:35 PM</p>
                </div>
              </div>

              <div className="flex">
                <div className="mr-4">
                  <div className="w-8 h-8 rounded-xl bg-pink-500 flex items-center justify-center">
                    <span className="text-white text-xs">XD</span>
                  </div>
                </div>
                <div className="mb-2">
                  <p className="text-sm font-medium">New order #9851258</p>
                  <p className="text-xs text-gray-400">18 DEC 4:41 PM</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
