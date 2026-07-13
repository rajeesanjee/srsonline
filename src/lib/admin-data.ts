export type AdminOrder = {
  id: string;
  customer: string;
  date: string;
  total: number;
  status: "Pending" | "Packed" | "Delivered";
};

export const adminOrders: AdminOrder[] = [
  { id: "SRS-1048", customer: "Kasi", date: "13 Jul 2026", total: 1840, status: "Pending" },
  { id: "SRS-1047", customer: "Meena Stores", date: "13 Jul 2026", total: 6325, status: "Packed" },
  { id: "SRS-1046", customer: "Anand", date: "12 Jul 2026", total: 975, status: "Delivered" },
  { id: "SRS-1045", customer: "Sri Murugan Cafe", date: "12 Jul 2026", total: 4210, status: "Delivered" },
  { id: "SRS-1044", customer: "Lakshmi", date: "11 Jul 2026", total: 1285, status: "Delivered" },
];

export const currency = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});
