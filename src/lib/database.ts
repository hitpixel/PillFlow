import { supabase } from "./supabase";
import { Customer, WebsterPackScan, Profile } from "../types/database";

export const database = {
  customers: {
    async getAll() {
      const { data, error } = await supabase
        .from("customers")
        .select("*")
        .order("name");

      if (error) throw error;
      return data;
    },

    async search(query: string) {
      const { data, error } = await supabase
        .from("customers")
        .select("*")
        .ilike("name", `%${query}%`)
        .order("name");

      if (error) throw error;
      return data;
    },

    async create(customer: Omit<Customer, "id" | "created_at" | "user_id">) {
      const { data, error } = await supabase
        .from("customers")
        .insert([customer])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
  },

  scans: {
    async getAll() {
      const { data, error } = await supabase
        .from("webster_pack_scans")
        .select(
          `
          *,
          customers (name)
        `,
        )
        .order("collection_date", { ascending: false });

      if (error) throw error;
      return data;
    },

    async create(scan: Omit<WebsterPackScan, "id" | "created_at" | "user_id">) {
      const { data, error } = await supabase
        .from("webster_pack_scans")
        .insert([scan])
        .select()
        .single();

      if (error) throw error;
      return data;
    },

    async getByCustomerId(customerId: string) {
      const { data, error } = await supabase
        .from("webster_pack_scans")
        .select(
          `
          *,
          customers (name)
        `,
        )
        .eq("customer_id", customerId)
        .order("collection_date", { ascending: false });

      if (error) throw error;
      return data;
    },
  },

  profiles: {
    async get(userId: string) {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) throw error;
      return data;
    },

    async upsert(profile: Partial<Profile> & { id: string }) {
      const { data, error } = await supabase
        .from("profiles")
        .upsert({
          ...profile,
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
  },
};
