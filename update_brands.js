const fs = require('fs');
let data = fs.readFileSync('src/data/sitapurData.ts', 'utf8');

const laptopBrands = `
  {
    id: 'hp',
    deviceType: 'laptop',
    name: 'HP',
    logo: '💻',
    popularModels: ['Pavilion', 'Envy', 'Spectre', 'Omen', 'ProBook', 'EliteBook', 'Other'],
  },
  {
    id: 'dell',
    deviceType: 'laptop',
    name: 'Dell',
    logo: '💻',
    popularModels: ['Inspiron', 'XPS', 'Alienware', 'Latitude', 'Vostro', 'Other'],
  },
  {
    id: 'lenovo',
    deviceType: 'laptop',
    name: 'Lenovo',
    logo: '💻',
    popularModels: ['IdeaPad', 'ThinkPad', 'Yoga', 'Legion', 'Other'],
  },
  {
    id: 'asus',
    deviceType: 'laptop',
    name: 'Asus',
    logo: '💻',
    popularModels: ['VivoBook', 'ZenBook', 'ROG', 'TUF', 'Other'],
  },
  {
    id: 'acer',
    deviceType: 'laptop',
    name: 'Acer',
    logo: '💻',
    popularModels: ['Aspire', 'Swift', 'Nitro', 'Predator', 'Other'],
  },
  {
    id: 'apple_mac',
    deviceType: 'laptop',
    name: 'Apple MacBook',
    logo: '🍏',
    popularModels: ['MacBook Air M1', 'MacBook Air M2', 'MacBook Air M3', 'MacBook Pro 13', 'MacBook Pro 14', 'MacBook Pro 16', 'Other'],
  },
`;

data = data.replace(/\];\n\nexport const SITAPUR_REPAIR_SERVICES/, laptopBrands + '];\n\nexport const SITAPUR_REPAIR_SERVICES');
fs.writeFileSync('src/data/sitapurData.ts', data);
