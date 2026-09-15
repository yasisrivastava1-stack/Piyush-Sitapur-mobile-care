const fs = require('fs');
let data = fs.readFileSync('src/data/sitapurData.ts', 'utf8');

const laptopServices = `
  {
    id: 'laptop_screen',
    title: 'Laptop Screen Replacement',
    shortDesc: 'Broken display, lines on screen, or blank screen fix',
    startingPrice: 3499,
    estimatedMinutes: 60,
    warrantyPeriod: '6 Months Warranty',
    icon: 'Monitor',
  },
  {
    id: 'laptop_keyboard',
    title: 'Keyboard Replacement',
    shortDesc: 'Missing keys, non-working keys, or water damaged keyboard',
    startingPrice: 1299,
    estimatedMinutes: 45,
    warrantyPeriod: '3 Months Warranty',
    icon: 'Keyboard',
  },
  {
    id: 'laptop_battery',
    title: 'Laptop Battery Replacement',
    shortDesc: 'Fast draining, swelling, or not holding charge',
    startingPrice: 1999,
    estimatedMinutes: 30,
    warrantyPeriod: '6 Months Warranty',
    icon: 'BatteryCharging',
  },
  {
    id: 'laptop_motherboard',
    title: 'Motherboard/Chip-Level Repair',
    shortDesc: 'Dead laptop, short circuit, or turning on then off',
    startingPrice: 2499,
    estimatedMinutes: 120,
    warrantyPeriod: '3 Months Warranty',
    icon: 'Cpu',
  },
  {
    id: 'laptop_upgrade',
    title: 'RAM / SSD Upgrade',
    shortDesc: 'Boost speed with SSD installation or RAM expansion',
    startingPrice: 999,
    estimatedMinutes: 30,
    warrantyPeriod: '1-3 Years Warranty (on parts)',
    icon: 'HardDrive',
  },
  {
    id: 'laptop_os',
    title: 'OS Installation & Software',
    shortDesc: 'Windows installation, virus removal, driver fixes',
    startingPrice: 499,
    estimatedMinutes: 60,
    warrantyPeriod: 'No Warranty',
    icon: 'Monitor',
  },
`;

data = data.replace(/\];\n+export const SERVICE_PROBLEMS/, laptopServices + '];\n\nexport const SERVICE_PROBLEMS');
fs.writeFileSync('src/data/sitapurData.ts', data);
