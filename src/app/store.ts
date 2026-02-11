// Global state management for sales orders
export type OrderStatus =
  | "Pending Planning"
  | "Pending Picker Duties"
  | "Pending Packer Duties"
  | "Pending Shipper Duties"
  | "Shipped";

export interface ProductItem {
  sku: string;
  quantity: number;
  availability?: "Yes" | "No";
  pickStatusReady?: "Yes" | "No";
  packStatusReady?: "Yes" | "No";
  shipStatus?: "Yes" | "No";
  remarks?: string;
  plannerRemarks?: string;
  pickerRemarks?: string;
  packerRemarks?: string;
  shipperRemarks?: string;
}

export interface SalesOrder {
  id: string;
  status: OrderStatus;
  remarks: string; // General remarks (for backward compatibility)
  plannerRemarks?: string;
  pickerRemarks?: string;
  packerRemarks?: string;
  shipperRemarks?: string;
  products: ProductItem[];
  plannerStartTime?: string;
  plannerEndTime?: string;
  pickerStartTime?: string;
  pickerEndTime?: string;
  packerStartTime?: string;
  packerEndTime?: string;
  shipperStartTime?: string;
  shipperEndTime?: string;
}

// Initial mock data
const initialOrders: SalesOrder[] = [
  {
    id: "SO-20260211-001",
    status: "Pending Planning",
    remarks: "4 SKUs totalling 38 items. Recommend verifying SKU-C003 stock levels before planning.",
    products: [
      { sku: "SKU-A001", quantity: 10 },
      { sku: "SKU-B002", quantity: 5 },
      { sku: "SKU-C003", quantity: 15 },
      { sku: "SKU-D004", quantity: 8 },
    ],
  },
  {
    id: "SO-20260211-002",
    status: "Pending Picker Duties",
    remarks: "Priority order. 2 of 3 SKUs available. SKU-G007 is out of stock — consider partial fulfillment.",
    products: [
      { sku: "SKU-E005", quantity: 20, availability: "Yes", plannerRemarks: "In stock" },
      { sku: "SKU-F006", quantity: 12, availability: "Yes", plannerRemarks: "Confirmed available" },
      { sku: "SKU-G007", quantity: 7, availability: "No", plannerRemarks: "Out of stock until next week" },
    ],
    plannerStartTime: "2026-02-11 08:15:00",
    plannerEndTime: "2026-02-11 08:45:00",
  },
  {
    id: "SO-20260211-003",
    status: "Pending Packer Duties",
    remarks: "All 3 SKUs available. 2 of 3 picked successfully. SKU-J010 has partial stock — verify before packing.",
    products: [
      { sku: "SKU-H008", quantity: 30, availability: "Yes", pickStatusReady: "Yes", plannerRemarks: "All good", pickerRemarks: "Picked from aisle 3" },
      { sku: "SKU-I009", quantity: 15, availability: "Yes", pickStatusReady: "Yes", plannerRemarks: "Available", pickerRemarks: "Picked successfully" },
      { sku: "SKU-J010", quantity: 25, availability: "Yes", pickStatusReady: "No", plannerRemarks: "Available", pickerRemarks: "Partial stock only" },
    ],
    plannerStartTime: "2026-02-11 07:30:00",
    plannerEndTime: "2026-02-11 08:00:00",
    pickerStartTime: "2026-02-11 08:15:00",
    pickerEndTime: "2026-02-11 09:00:00",
  },
  {
    id: "SO-20260211-004",
    status: "Pending Shipper Duties",
    remarks: "Handle with care. All items packed and ready. Double-wrapped fragile items per packer notes.",
    products: [
      {
        sku: "SKU-K011",
        quantity: 18,
        availability: "Yes",
        pickStatusReady: "Yes",
        packStatusReady: "Yes",
        plannerRemarks: "Available",
        pickerRemarks: "Picked from warehouse B",
        packerRemarks: "Packed in box #12",
      },
      {
        sku: "SKU-L012",
        quantity: 22,
        availability: "Yes",
        pickStatusReady: "Yes",
        packStatusReady: "Yes",
        plannerRemarks: "Available",
        pickerRemarks: "All items picked",
        packerRemarks: "Double-wrapped for safety",
      },
    ],
    plannerStartTime: "2026-02-11 06:45:00",
    plannerEndTime: "2026-02-11 07:15:00",
    pickerStartTime: "2026-02-11 07:30:00",
    pickerEndTime: "2026-02-11 08:30:00",
    packerStartTime: "2026-02-11 08:45:00",
    packerEndTime: "2026-02-11 09:30:00",
  },
  {
    id: "SO-20260211-005",
    status: "Shipped",
    remarks: "Delivered successfully. Total processing time: 4 hours. All 2 SKUs shipped on schedule.",
    products: [
      {
        sku: "SKU-M013",
        quantity: 40,
        availability: "Yes",
        pickStatusReady: "Yes",
        packStatusReady: "Yes",
        shipStatus: "Yes",
        plannerRemarks: "Available",
        pickerRemarks: "Picked",
        packerRemarks: "Packed",
        shipperRemarks: "Shipped via express",
      },
      {
        sku: "SKU-N014",
        quantity: 35,
        availability: "Yes",
        pickStatusReady: "Yes",
        packStatusReady: "Yes",
        shipStatus: "Yes",
        plannerRemarks: "Available",
        pickerRemarks: "Picked",
        packerRemarks: "Packed",
        shipperRemarks: "Shipped standard",
      },
    ],
    plannerStartTime: "2026-02-10 14:00:00",
    plannerEndTime: "2026-02-10 14:30:00",
    pickerStartTime: "2026-02-10 15:00:00",
    pickerEndTime: "2026-02-10 16:00:00",
    packerStartTime: "2026-02-10 16:15:00",
    packerEndTime: "2026-02-10 17:00:00",
    shipperStartTime: "2026-02-10 17:15:00",
    shipperEndTime: "2026-02-10 18:00:00",
  },
  {
    id: "SO-20260211-006",
    status: "Pending Planning",
    remarks: "Rush order. 4 SKUs totalling 110 items. High priority — expedite planning and allocate stock immediately.",
    products: [
      { sku: "SKU-O015", quantity: 50 },
      { sku: "SKU-P016", quantity: 28 },
      { sku: "SKU-Q017", quantity: 13 },
      { sku: "SKU-R018", quantity: 19 },
    ],
  },
];

// Simple in-memory store with event listeners
class OrderStore {
  private orders: SalesOrder[] = initialOrders;
  private listeners: Set<() => void> = new Set();

  getOrders(): SalesOrder[] {
    return this.orders;
  }

  getOrder(id: string): SalesOrder | undefined {
    return this.orders.find((order) => order.id === id);
  }

  updateOrder(id: string, updates: Partial<SalesOrder>) {
    const index = this.orders.findIndex((order) => order.id === id);
    if (index !== -1) {
      this.orders[index] = { ...this.orders[index], ...updates };
      this.notifyListeners();
    }
  }

  subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notifyListeners() {
    this.listeners.forEach((listener) => listener());
  }
}

export const orderStore = new OrderStore();

// Hook to use the store in components
import { useState, useEffect } from "react";

export function useOrderStore() {
  const [, forceUpdate] = useState({});

  useEffect(() => {
    const unsubscribe = orderStore.subscribe(() => {
      forceUpdate({});
    });
    return unsubscribe;
  }, []);

  return {
    orders: orderStore.getOrders(),
    getOrder: (id: string) => orderStore.getOrder(id),
    updateOrder: (id: string, updates: Partial<SalesOrder>) =>
      orderStore.updateOrder(id, updates),
  };
}