import { randomUUID } from "crypto";

export type AppointmentStatus =
  | "PENDING"
  | "CONFIRMED"
  | "REJECTED"
  | "COMPLETED";

export type Doctor = {
  id: string;
  name: string;
  specialization: string;
  qualification: string;
  registrationNumber: string;
  isAvailable: boolean;
  slotLimit: number;
};

export type Appointment = {
  id: string;
  patientName: string;
  patientPhone: string;
  patientEmail?: string;
  doctorId: string;
  date: string;
  slot: string;
  status: AppointmentStatus;
  notes?: string;
  createdAt: string;
};

export type InventoryItem = {
  id: string;
  medicineName: string;
  genericName: string;
  quantity: number;
  lowStockAt: number;
  expiryDate: string;
  supplierName: string;
  supplierPhone?: string;
};

export type Prescription = {
  id: string;
  doctorName: string;
  qualification: string;
  registrationNumber: string;
  patientName: string;
  patientAge: string;
  patientGender: string;
  diagnosis?: string;
  signature?: string;
  printSize: "A4" | "A5" | "CUSTOM";
  medicines: Array<{ generic: string; brand?: string; dosage: string }>;
  createdAt: string;
};

const doctors: Doctor[] = [
  {
    id: randomUUID(),
    name: "Dr. Ananya Rao",
    specialization: "Cardiology",
    qualification: "MD",
    registrationNumber: "KMC-112233",
    isAvailable: true,
    slotLimit: 20,
  },
  {
    id: randomUUID(),
    name: "Dr. Vikram Saini",
    specialization: "Orthopedics",
    qualification: "MS",
    registrationNumber: "MMC-678901",
    isAvailable: true,
    slotLimit: 16,
  },
];

const appointments: Appointment[] = [];

const inventory: InventoryItem[] = [
  {
    id: randomUUID(),
    medicineName: "CardioSafe 10",
    genericName: "ATORVASTATIN",
    quantity: 16,
    lowStockAt: 20,
    expiryDate: "2026-06-10",
    supplierName: "MedSupply India",
    supplierPhone: "+91 90000 11111",
  },
];

const prescriptions: Prescription[] = [];

export const demoStore = {
  doctors,
  appointments,
  inventory,
  prescriptions,
};
