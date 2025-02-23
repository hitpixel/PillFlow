import { useState, useEffect } from "react";
import { Card } from "../ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { useAuth } from "../auth/AuthProvider";
import { supabase } from "@/lib/supabase";

interface Profile {
  id: string;
  first_name: string;
  last_name: string;
  pharmacy_name: string;
  pharmacy_address: string;
  pharmacy_phone: string;
}

export default function ProfileSettings() {
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
    if (user) {
      loadProfile();
    }
  }, [user]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user?.id)
        .single();

      if (error) throw error;
      if (data) setProfile(data);
    } catch (error) {
      console.error("Error loading profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { error } = await supabase
        .from("profiles")
        .upsert({
          id: user?.id,
          ...profile,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user?.id);

      if (error) throw error;
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
