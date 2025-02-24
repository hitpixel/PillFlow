import React from "react";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./auth/AuthProvider";
import { supabase } from "@/lib/supabase";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

const Navbar = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  return (
    <div className="border-b bg-white">
      <div className="flex h-16 items-center px-4 max-w-[1512px] mx-auto">
        <div className="flex items-center gap-8">
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => navigate("/")}
          >
            <img
              src="./logo.svg"
              alt="PillFlow"
              className="h-10 w-10"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                if (!target.dataset.tried) {
                  target.dataset.tried = "true";
                  target.src = "https://pillflow.com.au/logo.svg";
                }
              }}
            />
            <span className="font-bold text-2xl">PillFlow</span>
          </div>
          <button
            onClick={() => navigate("/")}
            className="text-gray-600 hover:text-gray-900 transition-colors font-medium"
          >
            Home
          </button>
        </div>
        <div className="flex-1" />
        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Avatar>
                <AvatarFallback className="bg-blue-600 text-white">
                  {user?.email?.[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => navigate("/settings")}>
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
