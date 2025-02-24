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
  const [profile, setProfile] = React.useState<{
    first_name: string;
    last_name: string;
  } | null>(null);

  React.useEffect(() => {
    if (user?.id) {
      supabase
        .from("profiles")
        .select("first_name, last_name")
        .eq("id", user.id)
        .single()
        .then(({ data }) => {
          if (data) setProfile(data);
        });
    }
  }, [user?.id]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  return (
    <div className="border-b bg-white">
      <div className="flex h-16 items-center px-4 max-w-[1512px] mx-auto">
        <div className="flex items-center">
          <div className="flex items-center gap-3">
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
        </div>
        <div className="flex-1" />
        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Avatar>
                <AvatarFallback className="bg-blue-600 text-white">
                  {profile?.first_name?.[0] || user?.email?.[0].toUpperCase()}
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
