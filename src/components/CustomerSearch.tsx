import React, { useState, useEffect } from "react";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import { Avatar } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Search, User, Plus, Clock } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Label } from "./ui/label";
import { format } from "date-fns";
import { database } from "../lib/database";

interface Customer {
  id: string;
  name: string;
  dob: string;
  address: string;
  activeWebsterPacks: number;
}

interface CustomerSearchProps {
  onCustomerSelect?: (customers: Customer[]) => void;
  selectedCustomers?: Customer[];
  scanHistory?: Array<{
    id: string;
    customerName: string;
    barcode: string;
    collectionDate: Date;
    nextDueDate: Date;
    staffInitials: string;
  }>;
}

const initialFormState = {
  name: "",
  dob: "",
  address: "",
};

const CustomerSearch = ({
  onCustomerSelect = () => {},
  selectedCustomers = [],
  scanHistory = [],
}: CustomerSearchProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState(initialFormState);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    const loadCustomers = async () => {
      try {
        setLoading(true);
        const data = await database.customers.getAll();
        setCustomers(data);
      } catch (err) {
        setError("Failed to load customers");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadCustomers();
  }, []);

  const handleAddCustomer = async () => {
    try {
      const newCustomer = await database.customers.create({
        name: formData.name,
        dob: formData.dob,
        address: formData.address,
      });

      setCustomers([...customers, newCustomer]);
      setFormData(initialFormState);
      setIsDialogOpen(false);
    } catch (err) {
      setError("Failed to add customer");
      console.error(err);
    }
  };

  const getLastCollection = (customerName: string) => {
    const customerScans = scanHistory.filter(
      (scan) => scan.customerName === customerName,
    );
    if (customerScans.length === 0) return null;

    return customerScans.reduce((latest, scan) =>
      scan.collectionDate > latest.collectionDate ? scan : latest,
    ).collectionDate;
  };

  const filteredCustomers = customers.filter((customer) =>
    customer.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <Card className="w-full max-w-[1512px] h-[600px] bg-white p-6">
      <div className="flex flex-col h-full gap-4">
        <div className="flex items-center gap-4">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-green-500 hover:bg-green-600 text-white">
                <Plus className="h-4 w-4 mr-2" />
                Add New Customer
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Customer</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="John Smith"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dob">Date of Birth</Label>
                  <Input
                    id="dob"
                    type="date"
                    value={formData.dob}
                    onChange={(e) =>
                      setFormData({ ...formData, dob: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                    placeholder="123 Main St, Sydney NSW 2000"
                  />
                </div>
                <Button
                  className="w-full mt-4"
                  onClick={handleAddCustomer}
                  disabled={
                    !formData.name || !formData.dob || !formData.address
                  }
                >
                  Add Customer
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search customers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline">Advanced Search</Button>
        </div>

        <ScrollArea className="flex-1">
          <div className="grid grid-cols-3 gap-4 p-2">
            {filteredCustomers.map((customer) => {
              const lastCollection = getLastCollection(customer.name);
              return (
                <div
                  key={customer.id}
                  className={`p-4 rounded-lg border cursor-pointer transition-colors ${selectedCustomers.some((c) => c.id === customer.id) ? "bg-blue-50 border-blue-200" : "border-gray-200 hover:bg-gray-50"}`}
                  onClick={() => {
                    const isSelected = selectedCustomers.some(
                      (c) => c.id === customer.id,
                    );
                    const newSelection = isSelected
                      ? selectedCustomers.filter((c) => c.id !== customer.id)
                      : [...selectedCustomers, customer];
                    onCustomerSelect(newSelection);
                  }}
                >
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <User className="h-5 w-5" />
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium">{customer.name}</h3>
                        <Badge variant="secondary">
                          {customer.activeWebsterPacks} Packs
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-500">
                        DOB: {customer.dob}
                      </p>
                      <div className="flex justify-between items-center">
                        <p className="text-sm text-gray-500 truncate">
                          {customer.address}
                        </p>
                        {lastCollection && (
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <Clock className="h-3 w-3" />
                            {format(lastCollection, "MMM d, yyyy")}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </div>
    </Card>
  );
};

export default CustomerSearch;
