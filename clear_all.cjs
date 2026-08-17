const fs = require('fs');
let code = fs.readFileSync('src/data/initialData.ts', 'utf8');

const splitIndex = code.indexOf('export const SEED_BUY_REQUESTS');
if (splitIndex !== -1) {
  code = code.substring(0, splitIndex) + `export const SEED_BUY_REQUESTS: BuyQuoteRequest[] = [];

export const SEED_ORDERS: Order[] = [];

export const SEED_REPAIR_JOBS: RepairJob[] = [];

export const SEED_RETURN_REQUESTS: ReturnRequest[] = [];

export const SEED_WARRANTY_CLAIMS: WarrantyClaim[] = [];
`;
  fs.writeFileSync('src/data/initialData.ts', code);
  console.log('Cleared all other seeded data arrays.');
} else {
  console.log('Could not find SEED_BUY_REQUESTS');
}
