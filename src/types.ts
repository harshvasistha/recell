export interface DeviceModel {
  id: string;
  brand: string;
  name: string;
  variant: string; // e.g. 128GB / 256GB
  baseMarketPrice: number;
  imageUrl: string;
  releaseYear: number;
  popular?: boolean;
}

export interface ConditionAnswers {
  screenCondition: 'flawless' | 'minor_scratches' | 'cracked' | 'display_fault';
  bodyCondition: 'flawless' | 'minor_scratches' | 'dents' | 'broken_back';
  batteryHealth: 'above_85' | '75_to_85' | 'below_75';
  touchWorking: boolean;
  cameraWorking: boolean;
  speakerWorking: boolean;
  chargingPortWorking: boolean;
  boxIncluded: boolean;
  chargerIncluded: boolean;
  pincode: string;
  photos: {
    front?: string;
    back?: string;
    screenOn?: string;
    chargingPort?: string;
    damage?: string;
  };
}

export interface BuyQuoteRequest {
  id: string;
  date: string;
  modelId: string;
  modelName: string;
  brand: string;
  sellerName: string;
  sellerPhone: string;
  address: string;
  pincode: string;
  isLocalRadius: boolean;
  conditionAnswers: ConditionAnswers;
  roughQuoteMin: number;
  roughQuoteMax: number;
  scheduledDate?: string;
  scheduledSlot?: string;
  upiId?: string;
  status: 'quoted' | 'pickup_scheduled' | 'agent_inspecting' | 'completed_paid' | 'rejected' | 'sent_to_repair';
  finalAgreedPrice?: number;
  payoutTxnId?: string;
  agentNotes?: string;
  assignedAgent?: string;
  photos: string[];
}

export interface CatalogProduct {
  id: string;
  title: string;
  brand: string;
  model: string;
  storage: string;
  color: string;
  originalPrice: number;
  refurbPrice: number;
  conditionGrade: 'Like New' | 'Superb' | 'Good' | 'Open Box (5-10 Days)';
  warrantyMonths: number;
  batteryHealthPercent: number;
  images: string[];
  inStock: boolean;
  stockCount: number;
  serialImei: string;
  inspectionPassed: boolean;
  description: string;
  boxChargerIncluded: boolean;
  isOpenBox?: boolean;
  openBoxAgeDays?: number; // e.g. 5 to 10 days old
  brandWarrantyMonths?: number; // Official remaining brand warranty
  specs: {
    screen: string;
    processor: string;
    ram: string;
    camera: string;
  };
}

export interface OrderItem {
  productId: string;
  title: string;
  refurbPrice: number;
  image: string;
  serialImei: string;
  warrantyMonths: number;
}

export interface Order {
  id: string;
  date: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  shippingAddress: string;
  pincode: string;
  city: string;
  state: string;
  items: OrderItem[];
  totalAmount: number;
  paymentMethod: 'Razorpay UPI' | 'Razorpay Card' | 'COD (Deposit Paid)';
  paymentStatus: 'Paid' | 'Pending Token';
  orderStatus: 'Confirmed' | 'Packed' | 'In Transit' | 'Out for Delivery' | 'Delivered' | 'Returned';
  courierPartner: 'Delhivery Express' | 'Shiprocket' | 'BlueDart';
  trackingNumber: string;
  trackingHistory: { time: string; status: string; location: string }[];
  returnWindowExpiry: string; // ISO date
  warrantyExpiry: string; // ISO date
}

export interface ReturnRequest {
  id: string;
  orderId: string;
  customerName: string;
  itemTitle: string;
  reason: string;
  details: string;
  status: 'Requested' | 'Reverse Pickup Scheduled' | 'Inspected' | 'Refund Completed' | 'Rejected';
  reverseTrackingId: string;
  date: string;
}

export interface WarrantyClaim {
  id: string;
  orderId: string;
  itemTitle?: string;
  serialImei: string;
  customerName: string;
  customerPhone: string;
  issueType: 'Battery Fault' | 'Display/Touch Issue' | 'Speaker/Mic' | 'Charging Failure' | 'Software/Other';
  issueDetails: string;
  status: 'Submitted' | 'Pickup Arranged' | 'In Repair Queue' | 'Repaired & QC Passed' | 'Returned to Buyer' | 'Refunded';
  repairJobId?: string;
  reverseTrackingId: string;
  date: string;
}

export interface RepairJob {
  id: string;
  source: 'Buy Request' | 'Warranty Claim' | 'Stock Refurbish';
  referenceId: string; // Order or Buy Request ID
  deviceName: string;
  serialImei: string;
  defectSummary: string;
  technician: string;
  status: 'Booked' | 'Diagnosing' | 'Repairing' | 'QC Passed' | 'Completed';
  estimatedCost: number;
  sparePartsUsed: string[];
  createdDate: string;
  completedDate?: string;
  qcChecklist: {
    displayOk: boolean;
    touchOk: boolean;
    batteryOk: boolean;
    cameraOk: boolean;
    chargingOk: boolean;
    speakersOk: boolean;
  };
}

export interface PricingRules {
  conditionMultipliers: {
    screen: { flawless: number; minor_scratches: number; cracked: number; display_fault: number };
    body: { flawless: number; minor_scratches: number; dents: number; broken_back: number };
    battery: { above_85: number; '75_to_85': number; below_75: number };
  };
  deductions: {
    touchFault: number;
    cameraFault: number;
    speakerFault: number;
    chargingPortFault: number;
    missingBox: number;
    missingCharger: number;
  };
  demandFactors: {
    pincode250101Radius: number; // e.g. 1.05 boost for local quick turnaround
    defaultPanIndia: number;
  };
  minMarginPercent: number;
}
