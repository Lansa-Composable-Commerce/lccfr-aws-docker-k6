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

export default function () {
  // 1️⃣ LOGIN REQUEST
  const loginUrl = 'http://3.132.157.35:8080/cen/CNSLOGIN/login';
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
  console.log(loginRes.body);
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
  const accountsUrl = 'http://3.132.157.35:8080/cen/CNSACTSEL/accounts';
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

  const cartUrl = 'http://3.132.157.35:8080/cen/CNSCART/cart/add';
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
    'Authorization': `Bearer ${token}`,
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
  

  // 4️⃣ Simulate user wait time
  sleep(1);
}
