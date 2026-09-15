const fs = require('fs');
let data = fs.readFileSync('src/data/sitapurData.ts', 'utf8');

const laptopProblems = `
  'Laptop Not Turning On',
  'Laptop Screen Broken',
  'Keyboard Not Working',
  'Laptop Battery Not Charging',
  'Laptop Heating Issue',
  'Slow Performance / Hangs',
  'OS Not Booting / Blue Screen',
`;

data = data.replace(/'Other',\n\];/, "'Other',\n" + laptopProblems + '];');
fs.writeFileSync('src/data/sitapurData.ts', data);
