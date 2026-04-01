const fs = require('fs');
const files = [
  'c:/Users/Admin/Downloads/Ecommerce-Website-Java-main/frontend/src/pages/Home.jsx',
  'c:/Users/Admin/Downloads/Ecommerce-Website-Java-main/frontend/src/pages/Products.jsx',
  'c:/Users/Admin/Downloads/Ecommerce-Website-Java-main/frontend/src/pages/ProductDetails.jsx',
  'c:/Users/Admin/Downloads/Ecommerce-Website-Java-main/frontend/src/pages/Checkout.jsx',
  'c:/Users/Admin/Downloads/Ecommerce-Website-Java-main/frontend/src/pages/Cart.jsx'
];
files.forEach(f => {
  let c = fs.readFileSync(f, 'utf8');
  let newC = c.split('\\`').join('`').split('\\$').join('$');
  if (c !== newC) {
     fs.writeFileSync(f, newC);
     console.log('Fixed', f);
  }
});
