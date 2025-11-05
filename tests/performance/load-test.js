import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 5,
  duration: '20s',
  thresholds: {
    'http_req_failed{type:login}': ['rate<0.05'], // <5% login failures
    'http_req_failed{type:accounts}': ['rate<0.05'], // <5% accounts failures
    'checks{type:login}': ['rate>0.95'], // functional success rate
    'checks{type:cart}': ['rate>0.95'],
  },
};

//Shared Config
const BASE_URL = 'http://3.132.157.35:8080/cen';  
const loginUrl = `${BASE_URL}/CNSLOGIN/login`;
const accountsUrl = `${BASE_URL}/CNSACTSEL/accounts`;
const cartUrl = `${BASE_URL}/CNSCART/cart/add`;
const orderUrl = `${BASE_URL}/CNSCHKOUT/placeorder`;


export default function () {
  // 1️⃣ LOGIN REQUEST

  const loginPayload = JSON.stringify({
    Email: 'harvey@lna.com',
    Password: 'lansa',
  });

  const loginHeaders = {
    'Accept-Language': 'en',
    'Content-Type': 'application/json',
    'Cookie':
      'ce_ac_token=eyJhbGciOiJIUzM4NCIsInR5cCI6IkpXVCJ9.eyJ4dHJhcyI6eyJjZUdVSUQiOiIzYTMwNzkxZDJlZGIxOWFmY2I2MzZlY2Q0YzQzMmFkNjFkNDliYTIzMDAzZGY3MjAxNTY2ODAxODBiNDFkOTAxIiwiY2VVc2VyTmFtZSI6ImhhcnZleSIsImNlRW1haWwiOiJoYXJ2ZXlAbG5hLmNvbSIsImNlRmlyc3ROYW1lIjoiSGFydmV5IiwiY2VMYXN0TmFtZSI6IldhbGxiYW5nZXIifSwiaWF0IjoxNzYyMjI3NDcwLCJleHAiOjE3NjIyMjgwNzB9.SXzgguvj_0DFN9TRTt74ZSkOGJwH6No885Ul4Jzdow9crQT4yriCzNFLrkLhMU4B; ce_rf_token=eyJhbGciOiJIUzM4NCIsInR5cCI6IkpXVCJ9.eyJ4dHJhcyI6e30sImlhdCI6MTc2MjIyNzQ3MCwiZXhwIjoxNzY0ODE5NDcwfQ.c3t0aNh9dcvi7ZfnumTjn9fAjwDludTyknDAK5WP5GSM7lzRMesf-41ZLbwT0Fv',
  };

  const loginRes = http.post(loginUrl, loginPayload, { headers: loginHeaders, tags: { type: 'login' } });

  check(loginRes, {
    'login status is 200': (r) => r.status === 200,
    'login returns token or body': (r) => r.body && r.body.length > 0,
  });

  if (loginRes.status !== 200) {
    console.error(`❌ Login failed: ${loginRes.status} - ${loginRes.body}`);
    return;
  }
  // 2️⃣ EXTRACT TOKEN
  // Adjust field name depending on your backend's JSON format
  const token =
    loginRes.json('access_token') ||
    loginRes.json('token') ||
    loginRes.json('data.token') || 
    loginRes.json('LW3ACSTKN') ||
    null;

  if (!token) {
    console.warn('⚠️ No token returned — using fallback static token');
  }

  const bearerToken = token
    ? `Bearer ${token}`
    : 'Bearer eyJhbGciOiJIUzM4NCIsInR5cCI6IkpXVCJ9.eyJ4dHJhcyI6eyJjZUdVSUQiOiJmOGQ3MmRmYzk5OWRlNTdmYTVmYzMzYWFiODMyNGM1MGRhZjQzYWFmMzE4MDcwMThkMjkxNjZjZGEwYzY2ZTQyIiwiY2VVc2VyTmFtZSI6ImphbiIsImNlRW1haWwiOiJqYW5wYW9sby5tZXRpY2FAbGFuc2EuY29tIiwiY2VGaXJzdE5hbWUiOiJKYW4iLCJjZUxhc3ROYW1lIjoiTWV0aWNhIn0sImlhdCI6MTc2MjIyOTU2MCwiZXhwIjoxNzYyMjMwMTYwfQ.PwaUN6aMTO1hef1SfW4K0lZkKhKNcurGbMFrox5YMvtWe4bNo7ntzS1HlATD-hpZ'; // fallback if needed

  // 3️⃣ GET ACCOUNTS REQUEST
  const accountsHeaders = {
    'Accept-Language': 'en',
    'Content-Type': 'text/plain',
    'Authorization': bearerToken,
  };


  const accountsRes = http.get(accountsUrl, { headers: accountsHeaders, tags: { type: 'accounts' } });

  check(accountsRes, {
    'accounts status is 200': (r) => r.status === 200,
    'accounts returns data': (r) => r.body && r.body.length > 0,
  });

  if (accountsRes.status !== 200) {
    console.error(`❌ Accounts request failed: ${accountsRes.status} - ${accountsRes.body}`);
  }

  const cartPayload = JSON.stringify([
    { productCode: '2W10017', quantity: 1 },
    { productCode: '2000SX', quantity: 10 },
    { productCode: '2000S', quantity: 5 },
    { productCode: '7W10001', quantity: 30 },
    { productCode: '2W10020', quantity: 100 },
  ]);

  const cartHeaders = {
    'Accept-Language': 'en',
    'Content-Type': 'application/json',
    'Authorization': bearerToken,
    'Cookie':
      'ce_ac_token=eyJhbGciOiJIUzM4NCIsInR5cCI6IkpXVCJ9.eyJ4dHJhcyI6eyJjZUdVSUQiOiIzYTMwNzkxZDJlZGIxOWFmY2I2MzZlY2Q0YzQzMmFkNjFkNDliYTIzMDAzZGY3MjAxNTY2ODAxODBiNDFkOTAxIiwiY2VVc2VyTmFtZSI6ImhhcnZleSIsImNlRW1haWwiOiJoYXJ2ZXlAbG5hLmNvbSIsImNlRmlyc3ROYW1lIjoiSGFydmV5IiwiY2VMYXN0TmFtZSI6IldhbGxiYW5nZXIifSwiaWF0IjoxNzYyMjI3NDcwLCJleHAiOjE3NjIyMjgwNzB9.SXzgguvj_0DFN9TRTt74ZSkOGJwH6No885Ul4Jzdow9crQT4yriCzNFLrkLhMU4B; ce_rf_token=eyJhbGciOiJIUzM4NCIsInR5cCI6IkpXVCJ9.eyJ4dHJhcyI6e30sImlhdCI6MTc2MjIyNzQ3MCwiZXhwIjoxNzY0ODE5NDcwfQ.c3t0aNh9dcvi7ZfnumTjn9fAjwDludTyknDAK5WP5GSM7lzRMesf-41ZLbwT0Fv',
  };

  const cartRes = http.post(cartUrl, cartPayload, {
    headers: cartHeaders,
    tags: { type: 'cart' },
  });

  check(cartRes, {
    'cart status is 200': (r) => r.status === 200,
    'cart returned response': (r) => r.body && r.body.length > 0,
  });

  if (cartRes.status !== 200) {
    console.error(`❌ Add-to-cart failed: ${cartRes.status} - ${cartRes.body}`);
  }
  
    // 3️⃣ Place Order
    const poHeaders = {
    'Accept-Language': 'en',
    'Content-Type': 'application/json',
    'Authorization': bearerToken,
  };


  const orderPayload = JSON.stringify({
    shipToId: '0',
    cartHeaderComment: 'Test Order with Promo Code',
    paymentType: 'PO',
    poNumber: 'TESTPO',
  });

  const orderRes = http.post(orderUrl, orderPayload, {
    headers: poHeaders,
    tags: { type: 'order' },
  });

  check(orderRes, {
    'order success': (r) => r.status === 200 || r.status === 201,
  });


  // 4️⃣ Simulate user wait time
  sleep(1);
}

// import http from 'k6/http';
// import { check, sleep } from 'k6';
// import { SharedArray } from 'k6/data';

// export const options = {
//   vus: 5,
//   duration: '30s',
//   thresholds: {
//     'http_req_failed{type:login}': ['rate<0.05'],
//     'http_req_failed{type:cart}': ['rate<0.05'],
//     'http_req_failed{type:order}': ['rate<0.05'],
//     'checks{type:login}': ['rate>0.95'],
//     'checks{type:cart}': ['rate>0.95'],
//     'checks{type:order}': ['rate>0.95'],
//   },
// };

// // --- Shared config ---
// const BASE_URL = 'http://3.132.157.35:8080/cen';
// const LOGIN_URL = `${BASE_URL}/CNSCUST/auth/login`;
// const CART_URL = `${BASE_URL}/CNSCART/cart/add`;
// const ORDER_URL = `${BASE_URL}/CNSCHKOUT/placeorder`;

// export default function () {
//   // 1️⃣ Login
//   const loginPayload = JSON.stringify({
//     username: 'jan',
//     password: 'password123', // <-- replace with valid credentials
//   });

//   const loginRes = http.post(LOGIN_URL, loginPayload, {
//     headers: { 'Content-Type': 'application/json' },
//     tags: { type: 'login' },
//   });

//   check(loginRes, {
//     'login success': (r) => r.status === 200 && r.json('accessToken') !== undefined,
//   });

//   const token = loginRes.json('accessToken');
//   if (!token) {
//     console.error('❌ No token returned from login');
//     return;
//   }

//   const authHeaders = {
//     'Accept-Language': 'en',
//     'Content-Type': 'application/json',
//     Authorization: `Bearer ${token}`,
//   };

//   // 2️⃣ Add to Cart
//   const cartPayload = JSON.stringify([
//     { productCode: '2W10017', quantity: 1 },
//     { productCode: '2000SX', quantity: 10 },
//     { productCode: '2000S', quantity: 5 },
//     { productCode: '7W10001', quantity: 30 },
//     { productCode: '2W10020', quantity: 100 },
//   ]);

//   const cartRes = http.post(CART_URL, cartPayload, {
//     headers: authHeaders,
//     tags: { type: 'cart' },
//   });

//   check(cartRes, {
//     'cart success': (r) => r.status === 200 || r.status === 201,
//   });

//   // 3️⃣ Place Order
//   const orderPayload = JSON.stringify({
//     shipToId: '0',
//     cartHeaderComment: 'Test Order with Promo Code',
//     paymentType: 'PO',
//     poNumber: 'TESTPO',
//   });

//   const orderRes = http.post(ORDER_URL, orderPayload, {
//     headers: authHeaders,
//     tags: { type: 'order' },
//   });

//   check(orderRes, {
//     'order success': (r) => r.status === 200 || r.status === 201,
//   });

//   sleep(1);
// }
