import { createCareSeed } from "./careData";
import type { CareState } from "./careData";
export const DEMO_DATE = "2026-11-15";
export type Appliance = {
  id: string;
  name: string;
  category: string;
  brand: string;
  room: string;
  model: string;
  purchase: string;
  warranty: string;
  status: string;
  next: string;
  photo?: string;
};
export type Booking = {
  id: string;
  applianceId: string;
  service: string;
  team: string;
  date: string;
  time: string;
  location: string;
  note: string;
  fee: number;
  status: string;
};
export type Case = {
  id: string;
  applianceId: string;
  date: string;
  description: string;
  location: string;
  photos: number;
  status: string;
  bookingId?: string;
  protectionId?: string;
  packStatus?: "Draft" | "Ready for review";
};
export type Doc = {
  id: string;
  applianceId: string;
  type: string;
  name: string;
  date: string;
  available: boolean;
  status?: "Not added" | "Draft" | "Ready for review";
};
export type Activity = {
  id: string;
  title: string;
  detail: string;
  date: string;
};
export type DemoState = CareState & {
  appliances: Appliance[];
  bookings: Booking[];
  cases: Case[];
  documents: Doc[];
  checked: string[];
  activities: Activity[];
};
export const technicians = [
  "HomeCare Service Team",
  "Everyday Appliance Team",
  "Restore Technical Team",
];
export const tasks = [
  {
    id: "photos",
    group: "Appliance records",
    title: "Add photos of valuable appliances",
    detail: "Keep a clear record of each appliance and its model label.",
  },
  {
    id: "receipts",
    group: "Appliance records",
    title: "Save receipts and warranty documents",
    detail: "Keep appliance paperwork together in your document library.",
  },
  {
    id: "models",
    group: "Appliance records",
    title: "Record model and purchase information",
    detail: "Make future service requests easier with complete records.",
  },
  {
    id: "moving",
    group: "Household planning",
    title: "Identify appliances that require professional moving support",
    detail: "Plan ahead for heavy or fixed appliances.",
  },
  {
    id: "storage",
    group: "Household planning",
    title: "Plan a dry storage location for documents",
    detail: "Choose an accessible place for important records.",
  },
  {
    id: "contacts",
    group: "Professional support",
    title: "Save technician contact information",
    detail: "Keep your preferred service teams easy to find.",
  },
  {
    id: "visit",
    group: "Professional support",
    title: "Arrange a preparation consultation",
    detail: "Discuss appliance preparation with a qualified professional.",
  },
];
const baseData = {
  appliances: [
    {
      id: "washer",
      brand: "Aster",
      name: "Front-load Washing Machine",
      category: "Washing machine",
      room: "Laundry Room",
      model: "FL-9000 · 9 kg",
      purchase: "2025-02-18",
      warranty: "2028-02-18",
      status: "Needs inspection",
      next: "2026-11-18",
    },
    {
      id: "fridge",
      brand: "Nova",
      name: "Refrigerator",
      category: "Refrigerator",
      room: "Kitchen",
      model: "RF-420 · 420 L",
      purchase: "2024-06-12",
      warranty: "2027-06-12",
      status: "Up to date",
      next: "2027-01-12",
    },
    {
      id: "tv",
      brand: "Northline",
      name: "Smart TV",
      category: "Television",
      room: "Living Room",
      model: "TV-55U · 55 inch",
      purchase: "2025-08-02",
      warranty: "2027-08-02",
      status: "Up to date",
      next: "",
    },
    {
      id: "ac",
      brand: "Nova",
      name: "Air Conditioner",
      category: "Air conditioner",
      room: "Bedroom",
      model: "AC-120 · 12,000 BTU",
      purchase: "2024-04-10",
      warranty: "2027-04-10",
      status: "Service due",
      next: "2026-11-20",
    },
    {
      id: "microwave",
      brand: "Aster",
      name: "Microwave",
      category: "Microwave",
      room: "Kitchen",
      model: "MW-25 · 25 L",
      purchase: "2023-09-15",
      warranty: "2025-09-15",
      status: "Up to date",
      next: "",
    },
    {
      id: "pump",
      brand: "Northline",
      name: "Water Pump",
      category: "Water pump",
      room: "Utility Area",
      model: "WP-250 · 250 W",
      purchase: "2024-03-05",
      warranty: "2027-03-05",
      status: "Service due",
      next: "2026-11-25",
    },
  ],
  bookings: [
    {
      id: "BK-2026-001",
      applianceId: "ac",
      service: "Routine maintenance",
      team: technicians[0],
      date: "2026-11-20",
      time: "09:00 – 11:00",
      location: "Demo home · Bedroom",
      note: "Routine filter cleaning and general maintenance.",
      fee: 450,
      status: "Scheduled",
    },
  ],
  cases: [
    {
      id: "RC-2026-001",
      applianceId: "washer",
      date: "2026-11-12",
      description:
        "Water exposure was observed near the base of the washing machine. The appliance has not been powered on. Professional inspection is needed.",
      location: "Laundry Room",
      photos: 3,
      status: "Awaiting inspection",
    },
  ],
  documents: [
    {
      id: "doc-1",
      applianceId: "washer",
      type: "Receipt",
      name: "Washing machine purchase receipt",
      date: "2025-02-18",
      available: true,
    },
    {
      id: "doc-2",
      applianceId: "washer",
      type: "Warranty",
      name: "Washing machine warranty",
      date: "2025-02-18",
      available: true,
    },
    {
      id: "doc-3",
      applianceId: "washer",
      type: "Appliance photo",
      name: "Washing machine · 3 sample records",
      date: "2026-11-12",
      available: true,
    },
    {
      id: "doc-4",
      applianceId: "washer",
      type: "Inspection report",
      name: "Professional inspection report",
      date: "",
      available: false,
    },
    {
      id: "doc-5",
      applianceId: "washer",
      type: "Policy document",
      name: "Home appliance policy document",
      date: "",
      available: false,
    },
    {
      id: "doc-6",
      applianceId: "fridge",
      type: "Receipt",
      name: "Refrigerator purchase receipt",
      date: "2024-06-12",
      available: true,
    },
    {
      id: "doc-7",
      applianceId: "ac",
      type: "Warranty",
      name: "Air conditioner warranty",
      date: "2024-04-10",
      available: true,
    },
  ],
  checked: ["photos", "receipts", "models"],
  activities: [
    {
      id: "act1",
      title: "Service visit scheduled",
      detail: "Air Conditioner · Routine maintenance",
      date: "2026-11-14",
    },
    {
      id: "act2",
      title: "Damage record created",
      detail: "Washing machine · Awaiting inspection",
      date: "2026-11-12",
    },
    {
      id: "act3",
      title: "Appliance records updated",
      detail: "Receipts and warranty documents saved",
      date: "2026-11-10",
    },
  ],
};
export const initialData: DemoState = {
  ...baseData,
  ...createCareSeed(baseData.appliances),
};
export const dateLabel = (date: string) =>
  date
    ? new Date(date + "T12:00:00").toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "Not added";
export const money = (n: number) => "THB " + n.toLocaleString("en");
export const dueSoon = (a: Appliance) =>
  !!a.next && a.next >= DEMO_DATE && a.next <= "2026-12-15";
export const nextId = (prefix: string) =>
  `${prefix}-${crypto.randomUUID().slice(0, 8)}`;
