import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "../ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { useAuth } from "../auth/AuthProvider";
import { supabase } from "@/lib/supabase";
import { usePageTitle } from "@/hooks/usePageTitle";
import { ArrowLeft } from "lucide-react";

interface Profile {
  id: string;
  first_name: string;
  last_name: string;
  pharmacy_name: string;
  pharmacy_address: string;
  pharmacy_phone: string;
}

export default function ProfileSettings() {
  usePageTitle("Settings");
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<Profile>({
    id: "",
    first_name: "",
    last_name: "",
    pharmacy_name: "",
    pharmacy_address: "",
    pharmacy_phone: "",
  });

  useEffect(() => {
    const initializeProfile = async () => {
      if (!user) return;

      try {
        setLoading(true);
        // First try to get existing profile
        const { data: existingProfile, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        // Get name from various sources
        const metadata = user.user_metadata;
        const identity = user.identities?.[0]?.identity_data;
        const name = identity?.full_name || identity?.name || "";
        const [firstName = "", ...lastNameParts] = name.split(" ");
        const lastName = lastNameParts.join(" ");

        const profileData = {
          id: user.id,
          first_name:
            existingProfile?.first_name ||
            metadata?.first_name ||
            metadata?.given_name ||
            identity?.given_name ||
            firstName ||
            "",
          last_name:
            existingProfile?.last_name ||
            metadata?.last_name ||
            metadata?.family_name ||
            identity?.family_name ||
            lastName ||
            "",
          pharmacy_name: existingProfile?.pharmacy_name || "",
          pharmacy_address: existingProfile?.pharmacy_address || "",
          pharmacy_phone: existingProfile?.pharmacy_phone || "",
        };

        setProfile(profileData);

        // If no existing profile, create one
        if (!existingProfile) {
          const { error: upsertError } = await supabase
            .from("profiles")
            .upsert(profileData);

          if (upsertError) throw upsertError;
        }
      } catch (error) {
        console.error("Error initializing profile:", error);
      } finally {
        setLoading(false);
      }
    };

    initializeProfile();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { error } = await supabase.from("profiles").upsert({
        id: user?.id,
        ...profile,
        updated_at: new Date().toISOString(),
      });

      if (error) throw error;

      // Also update user metadata
      await supabase.auth.updateUser({
        data: {
          first_name: profile.first_name,
          last_name: profile.last_name,
        },
      });

      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Error updating profile!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-2xl mx-auto mb-4">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="group flex items-center gap-2 hover:bg-slate-100 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Return to Dashboard
        </Button>
      </div>

      <Card className="max-w-2xl mx-auto p-6 bg-white">
        <h1 className="text-2xl font-bold mb-6">Profile Settings</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="first_name">First Name</Label>
              <Input
                id="first_name"
                value={profile.first_name}
                onChange={(e) =>
                  setProfile({ ...profile, first_name: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="last_name">Last Name</Label>
              <Input
                id="last_name"
                value={profile.last_name}
                onChange={(e) =>
                  setProfile({ ...profile, last_name: e.target.value })
                }
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="pharmacy_name">Pharmacy Name</Label>
            <Input
              id="pharmacy_name"
              value={profile.pharmacy_name}
              onChange={(e) =>
                setProfile({ ...profile, pharmacy_name: e.target.value })
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="pharmacy_address">Pharmacy Address</Label>
            <Input
              id="pharmacy_address"
              value={profile.pharmacy_address}
              onChange={(e) =>
                setProfile({ ...profile, pharmacy_address: e.target.value })
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="pharmacy_phone">Pharmacy Phone</Label>
            <Input
              id="pharmacy_phone"
              value={profile.pharmacy_phone}
              onChange={(e) =>
                setProfile({ ...profile, pharmacy_phone: e.target.value })
              }
              required
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </form>
      </Card>
    </div>
  );
}
