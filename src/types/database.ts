export interface Customer {
  id: string;
  user_id: string;
  name: string;
  dob: string;
  address: string;
  created_at: string;
}

export interface WebsterPackScan {
  id: string;
  user_id: string;
  customer_id: string;
  barcode: string;
  staff_initials: string;
  weeks_supply: number;
  collection_date: string;
  next_due_date: string;
  created_at: string;
}

export interface Profile {
  id: string;
  first_name: string;
  last_name: string;
  pharmacy_name: string;
  pharmacy_address: string;
  pharmacy_phone: string;
  created_at: string;
  updated_at: string;
}
