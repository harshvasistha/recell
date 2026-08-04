import { ConditionAnswers, PricingRules } from '../types';
import { LOCAL_SERVICED_PINCODES } from '../data/initialData';

export interface QuoteBreakdown {
  basePrice: number;
  screenMultiplier: number;
  bodyMultiplier: number;
  batteryMultiplier: number;
  deductions: {
    label: string;
    amount: number;
  }[];
  localDemandBonus: number;
  calculatedBeforeDiscount: number;
  discountAmount: number;
  fifteenPercentDeduction: number;
  roughQuoteMin: number;
  roughQuoteMax: number;
  roughQuoteEstimated: number;
  isLocalRadius: boolean;
}

export function isLocalPincode(pincode: string): boolean {
  if (!pincode) return false;
  const cleaned = pincode.trim();
  // Check direct list or 250101 prefix or nearby Khekra/Baghpat district pincodes starting with 250
  if (LOCAL_SERVICED_PINCODES.includes(cleaned)) return true;
  if (cleaned.startsWith('2501') || cleaned.startsWith('2500')) return true;
  return false;
}

export function calculateRoughQuote(
  basePrice: number,
  answers: ConditionAnswers,
  rules: PricingRules
): QuoteBreakdown {
  const { conditionMultipliers, deductions, demandFactors } = rules;

  const screenMult = conditionMultipliers.screen[answers.screenCondition] || 1.0;
  const bodyMult = conditionMultipliers.body[answers.bodyCondition] || 1.0;
  const batteryMult = conditionMultipliers.battery[answers.batteryHealth] || 1.0;

  // Combined condition score
  const conditionFactor = (screenMult + bodyMult + batteryMult) / 3;

  let netPrice = basePrice * conditionFactor;

  const deductionsList: { label: string; amount: number }[] = [];

  if (!answers.touchWorking) {
    deductionsList.push({ label: 'Touch Screen Fault', amount: deductions.touchFault });
    netPrice -= deductions.touchFault;
  }
  if (!answers.cameraWorking) {
    deductionsList.push({ label: 'Camera Fault', amount: deductions.cameraFault });
    netPrice -= deductions.cameraFault;
  }
  if (!answers.speakerWorking) {
    deductionsList.push({ label: 'Speaker Fault', amount: deductions.speakerFault });
    netPrice -= deductions.speakerFault;
  }
  if (!answers.chargingPortWorking) {
    deductionsList.push({ label: 'Charging Port Fault', amount: deductions.chargingPortFault });
    netPrice -= deductions.chargingPortFault;
  }
  if (!answers.boxIncluded) {
    deductionsList.push({ label: 'Missing Original Box', amount: deductions.missingBox });
    netPrice -= deductions.missingBox;
  }
  if (!answers.chargerIncluded) {
    deductionsList.push({ label: 'Missing Original Fast Charger', amount: deductions.missingCharger });
    netPrice -= deductions.missingCharger;
  }

  // Ensure quote doesn't drop below 15% of base price
  const floorPrice = Math.round(basePrice * 0.15);
  netPrice = Math.max(netPrice, floorPrice);

  const localRadius = isLocalPincode(answers.pincode);
  const demandMult = localRadius ? demandFactors.pincode250101Radius : demandFactors.defaultPanIndia;
  
  const localBonusAmount = Math.round(netPrice * (demandMult - 1.0));
  netPrice = netPrice * demandMult;

  // Diagnostic Engine calculated price before final 15% backend deduction
  const calculatedBeforeDiscount = Math.round(netPrice / 100) * 100;

  // Base diagnostic engine calculation
  const discountAmount = Math.round((calculatedBeforeDiscount * 0.20) / 100) * 100;
  const initialEstimate = Math.max(0, calculatedBeforeDiscount - discountAmount);

  // Apply required 15% backend deduction on the rough estimated price
  const fifteenPercentDeduction = Math.round((initialEstimate * 0.15) / 100) * 100;
  const estimated = Math.max(0, initialEstimate - fifteenPercentDeduction);

  const minQuote = Math.round((estimated * 0.95) / 100) * 100;
  const maxQuote = Math.round((estimated * 1.05) / 100) * 100;

  return {
    basePrice,
    screenMultiplier: screenMult,
    bodyMultiplier: bodyMult,
    batteryMultiplier: batteryMult,
    deductions: deductionsList,
    localDemandBonus: localBonusAmount,
    calculatedBeforeDiscount,
    discountAmount,
    fifteenPercentDeduction,
    roughQuoteMin: minQuote,
    roughQuoteMax: maxQuote,
    roughQuoteEstimated: estimated,
    isLocalRadius: localRadius
  };
}
