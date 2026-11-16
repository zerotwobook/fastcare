import type { Appliance, DemoState } from "./data";

export type Plan = {
  id: string;
  name: string;
  provider: string;
  type: string;
  brands: string[];
  categories: string[];
  price: number;
  limit: number;
  excess: number;
  months: number;
  flood: boolean;
  waitingDays: number;
  summary: string[];
  exclusions: string[];
  floodTerms: string;
};
export type PlanPeriod = { start: string; end: string; selectedAt: string };
export type SelectedPlan = {
  id: string;
  applianceId: string;
  planId: string;
  start: string;
  end: string;
  renewal: string;
  selectedAt: string;
  periods: PlanPeriod[];
};
export type Consultation = {
  id: string;
  applianceId: string;
  topic: string;
  channel: string;
  team: string;
  date: string;
  status: string;
  summary: string;
  messages: { role: "user" | "technician"; text: string }[];
};
export type MovingPriority = {
  applianceId: string;
  priority: "High" | "Medium" | "Low";
  note: string;
  assistance: boolean;
};
export type PhotoRecord = {
  id: string;
  applianceId: string;
  kind: "before" | "after";
  date: string;
  description: string;
  sample: boolean;
  caseId?: string;
};
export type LocalPhoto = PhotoRecord & { url: string };
export type MaintenanceSchedule = {
  applianceId: string;
  last: string;
  next: string;
  reminder: boolean;
};
export type MaintenanceRecord = {
  id: string;
  applianceId: string;
  date: string;
  service: string;
};
export type SelectedPackage = {
  id: string;
  applianceId: string;
  packageId: string;
  date: string;
};
export type RepairIssue = {
  id: string;
  applianceId: string;
  date: string;
  description: string;
  status: string;
  bookingId?: string;
};
export type Callback = {
  id: string;
  applianceId: string;
  issue: string;
  channel: string;
  team: string;
  date: string;
};
export type CareState = {
  selectedProtectionPlans: SelectedPlan[];
  consultations: Consultation[];
  movingPriorities: MovingPriority[];
  movingPlanSaved: boolean;
  photoRecords: PhotoRecord[];
  maintenanceSchedules: MaintenanceSchedule[];
  maintenanceHistory: MaintenanceRecord[];
  selectedMaintenancePackages: SelectedPackage[];
  repairIssues: RepairIssue[];
  callbacks: Callback[];
};

const categories = [
  "Washing machine",
  "Refrigerator",
  "Television",
  "Air conditioner",
  "Microwave",
  "Water pump",
];
export const sampleBrands = ["Aster", "Nova", "Northline"];
export const protectionPlans: Plan[] = [
  {
    id: "essential",
    name: "Everyday Essential",
    provider: "Haven Protection · sample provider",
    type: "Appliance protection",
    brands: sampleBrands,
    categories: categories.filter((c) => c !== "Water pump"),
    price: 590,
    limit: 10000,
    excess: 500,
    months: 12,
    flood: false,
    waitingDays: 14,
    summary: [
      "Illustrative mechanical and electrical breakdown support",
      "Professional assessment and repair coordination",
    ],
    exclusions: [
      "Flood and other water exposure",
      "Pre-existing damage",
      "Cosmetic damage and normal wear",
    ],
    floodTerms: "Flood damage is excluded from this illustrative plan.",
  },
  {
    id: "flood-ready",
    name: "Flood Ready",
    provider: "Riverstone Cover · sample provider",
    type: "Illustrative insurance plan",
    brands: sampleBrands,
    categories: categories.filter((c) => c !== "Television"),
    price: 990,
    limit: 25000,
    excess: 1000,
    months: 12,
    flood: true,
    waitingDays: 30,
    summary: [
      "Illustrative breakdown and flood-related damage review",
      "Inspection records and document preparation support",
    ],
    exclusions: [
      "Damage occurring before the selected period",
      "Incidents within the waiting period",
      "Unapproved modifications and intentional damage",
    ],
    floodTerms:
      "Flood exposure may be reviewed after the 30-day waiting period, during the selected term, subject to sample conditions and provider review.",
  },
  {
    id: "complete",
    name: "Complete Home Care",
    provider: "Oakline Assurance · sample provider",
    type: "Illustrative insurance plan",
    brands: ["Aster", "Nova"],
    categories,
    price: 1590,
    limit: 40000,
    excess: 1500,
    months: 12,
    flood: true,
    waitingDays: 30,
    summary: [
      "Illustrative breakdown and conditional flood support",
      "Higher sample limit for eligible appliances",
    ],
    exclusions: [
      "Pre-existing damage and events before selection",
      "Incidents within the waiting period",
      "Commercial use and consumable parts",
    ],
    floodTerms:
      "Conditional flood review for eligible Aster and Nova appliances after the 30-day waiting period. Every event remains subject to provider review.",
  },
];
export const technicianProfiles = [
  {
    name: "HomeCare Service Team",
    brands: ["Aster", "Nova"],
    availability: "Available in this demo",
    specialty: "Preventive maintenance and general care",
  },
  {
    name: "Everyday Appliance Team",
    brands: ["Nova", "Northline"],
    availability: "Next sample slot · 18 Nov",
    specialty: "Inspection and repair consultation",
  },
  {
    name: "Restore Technical Team",
    brands: ["Aster", "Northline"],
    availability: "Available in this demo",
    specialty: "Flood inspection and recovery coordination",
  },
];
export const maintenancePackages = [
  {
    id: "seasonal",
    name: "Seasonal Care",
    visits: 2,
    months: 12,
    price: 890,
    brands: sampleBrands,
    categories: ["Air conditioner", "Washing machine", "Refrigerator"],
    services: [
      "Two preventive service visits",
      "Cleaning and condition checks",
      "Sample maintenance records",
    ],
  },
  {
    id: "kitchen",
    name: "Kitchen Essentials",
    visits: 2,
    months: 12,
    price: 790,
    brands: ["Aster", "Nova"],
    categories: ["Refrigerator", "Microwave"],
    services: [
      "Two scheduled care visits",
      "General cleaning and inspection",
      "Care reminders",
    ],
  },
  {
    id: "utility",
    name: "Utility Care",
    visits: 3,
    months: 12,
    price: 1290,
    brands: ["Aster", "Northline"],
    categories: ["Washing machine", "Water pump"],
    services: [
      "Three preventive care visits",
      "Professional condition checks",
      "Maintenance history updates",
    ],
  },
];

export function eligible(
  plan: { brands: string[]; categories: string[] },
  appliance: Appliance,
) {
  return (
    plan.brands.includes(appliance.brand) &&
    plan.categories.includes(appliance.category)
  );
}
export function addDays(value: string, days: number) {
  const date = new Date(value + "T12:00:00Z");
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}
export function annualEnd(start: string) {
  const date = new Date(start + "T12:00:00Z");
  date.setUTCFullYear(date.getUTCFullYear() + 1);
  return addDays(date.toISOString().slice(0, 10), -1);
}
export function planStatus(selected: SelectedPlan | undefined, today: string) {
  if (!selected) return "No plan selected";
  if (selected.end < today) return "Expired — demo";
  if (selected.start > today) return "Scheduled — demo";
  if (selected.renewal <= today) return "Renewal due — demo";
  return "Active — demo";
}
export function latestPlan(selections: SelectedPlan[], applianceId: string) {
  return selections.filter((s) => s.applianceId === applianceId).at(-1);
}
export function incidentPlan(
  selections: SelectedPlan[],
  applianceId: string,
  date: string,
) {
  return [...selections]
    .reverse()
    .find(
      (s) =>
        s.applianceId === applianceId &&
        s.periods.some(
          (p) => p.start <= date && p.end >= date && p.selectedAt <= date,
        ),
    );
}
export function createCareSeed(appliances: Appliance[]): CareState {
  const seeds = [
    {
      id: "SP-washer",
      applianceId: "washer",
      planId: "flood-ready",
      start: "2026-01-01",
      end: "2026-12-31",
    },
    {
      id: "SP-fridge",
      applianceId: "fridge",
      planId: "essential",
      start: "2025-12-01",
      end: "2026-11-30",
    },
    {
      id: "SP-tv",
      applianceId: "tv",
      planId: "essential",
      start: "2025-10-01",
      end: "2026-09-30",
    },
  ];
  return {
    selectedProtectionPlans: seeds
      .filter((s) => appliances.some((a) => a.id === s.applianceId))
      .map((s) => ({
        ...s,
        selectedAt: s.start,
        renewal: addDays(s.end, -15),
        periods: [{ start: s.start, end: s.end, selectedAt: s.start }],
      })),
    consultations: [],
    movingPriorities: appliances.map((a) => ({
      applianceId: a.id,
      priority: a.id === "microwave" || a.id === "washer" ? "High" : "Medium",
      assistance: [
        "Washing machine",
        "Refrigerator",
        "Water pump",
        "Air conditioner",
      ].includes(a.category),
      note: [
        "Washing machine",
        "Refrigerator",
        "Water pump",
        "Air conditioner",
      ].includes(a.category)
        ? "Arrange qualified moving assistance while conditions are safe."
        : "Plan an accessible, dry storage location in advance.",
    })),
    movingPlanSaved: false,
    photoRecords: [
      ...appliances.map((a) => ({
        id: "before-" + a.id,
        applianceId: a.id,
        kind: "before" as const,
        date: "2026-11-01",
        description: "Sample appliance condition record before the incident.",
        sample: true,
      })),
      ...appliances
        .filter((a) => a.id === "washer")
        .flatMap((a) =>
          [1, 2, 3].map((index) => ({
            id: "after-washer-" + index,
            applianceId: a.id,
            caseId: "RC-2026-001",
            kind: "after" as const,
            date: "2026-11-12",
            description: "Sample incident image record " + index,
            sample: true,
          })),
        ),
    ],
    maintenanceSchedules: appliances.map((a) => ({
      applianceId: a.id,
      last: a.id === "ac" ? "2026-05-20" : "",
      next: a.next,
      reminder: true,
    })),
    maintenanceHistory: appliances.some((a) => a.id === "ac")
      ? [
          {
            id: "MH-ac",
            applianceId: "ac",
            date: "2026-05-20",
            service: "Sample preventive cleaning and condition check",
          },
        ]
      : [],
    selectedMaintenancePackages: [],
    repairIssues: [],
    callbacks: [],
  };
}

export function migrateDemoState(raw: unknown, fallback: DemoState): DemoState {
  if (!raw || typeof raw !== "object") return structuredClone(fallback);
  const saved = raw as Partial<DemoState>;
  if (!Array.isArray(saved.appliances)) return structuredClone(fallback);
  const appliances = saved.appliances
    .filter((a) => a && typeof a.id === "string" && typeof a.name === "string")
    .map((a) => ({
      ...a,
      brand:
        a.brand ||
        fallback.appliances.find((x) => x.id === a.id)?.brand ||
        "Aster",
    }));
  const seed = createCareSeed(appliances);
  const merged = {
    ...structuredClone(fallback),
    ...seed,
    ...saved,
    appliances,
  } as DemoState;
  for (const key of [
    "bookings",
    "cases",
    "documents",
    "checked",
    "activities",
    "selectedProtectionPlans",
    "consultations",
    "movingPriorities",
    "photoRecords",
    "maintenanceSchedules",
    "maintenanceHistory",
    "selectedMaintenancePackages",
    "repairIssues",
    "callbacks",
  ] as const) {
    if (!Array.isArray(merged[key]))
      Object.assign(merged, { [key]: fallback[key] });
  }
  merged.documents = merged.documents.map((d) => ({
    ...d,
    status: d.available ? d.status || "Draft" : "Not added",
  }));
  merged.cases = merged.cases.map((c) => ({
    ...c,
    packStatus: c.packStatus || "Draft",
    protectionId:
      c.protectionId ||
      incidentPlan(merged.selectedProtectionPlans, c.applianceId, c.date)?.id,
  }));
  return merged;
}
