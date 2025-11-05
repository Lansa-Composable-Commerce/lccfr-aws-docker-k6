import http from 'k6/http';
import { check, sleep } from 'k6';
import { SharedArray } from 'k6/data';

export const options = {
  vus: 5,
  duration: '30s',
  thresholds: {
    'http_req_failed{type:login}': ['rate<0.05'],
    'http_req_failed{type:cart}': ['rate<0.05'],
    'http_req_failed{type:order}': ['rate<0.05'],
    'checks{type:login}': ['rate>0.95'],
    'checks{type:cart}': ['rate>0.95'],
    'checks{type:order}': ['rate>0.95'],
  },
};

// --- Shared config ---
const BASE_URL = 'http://3.132.157.35:8080/cen';
const LOGIN_URL = `${BASE_URL}/CNSCUST/auth/login`;
const CART_URL = `${BASE_URL}/CNSCART/cart/add`;
const ORDER_URL = `${BASE_URL}/CNSCHKOUT/placeorder`;

export default function () {
  // 1️⃣ Login
  const loginPayload = JSON.stringify({
    username: 'jan',
    password: 'password123', // <-- replace with valid credentials
  });

  const loginRes = http.post(LOGIN_URL, loginPayload, {
    headers: { 'Content-Type': 'application/json' },
    tags: { type: 'login' },
  });

  check(loginRes, {
    'login success': (r) => r.status === 200 && r.json('accessToken') !== undefined,
  });

  const token = loginRes.json('accessToken');
  if (!token) {
    console.error('❌ No token returned from login');
    return;
  }

  const authHeaders = {
    'Accept-Language': 'en',
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };

  // 2️⃣ Add to Cart
  const cartPayload = JSON.stringify([
    { productCode: '2W10017', quantity: 1 },
    { productCode: '2000SX', quantity: 10 },
    { productCode: '2000S', quantity: 5 },
    { productCode: '7W10001', quantity: 30 },
    { productCode: '2W10020', quantity: 100 },
  ]);

  const cartRes = http.post(CART_URL, cartPayload, {
    headers: authHeaders,
    tags: { type: 'cart' },
  });

  check(cartRes, {
    'cart success': (r) => r.status === 200 || r.status === 201,
  });

  // 3️⃣ Place Order
  const orderPayload = JSON.stringify({
    shipToId: '0',
    cartHeaderComment: 'Test Order with Promo Code',
    paymentType: 'PO',
    poNumber: 'TESTPO',
  });

  const orderRes = http.post(ORDER_URL, orderPayload, {
    headers: authHeaders,
    tags: { type: 'order' },
  });

  check(orderRes, {
    'order success': (r) => r.status === 200 || r.status === 201,
  });

  sleep(1);
}
