import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 5,
  duration: '20s',
  thresholds: {
    'http_req_failed{type:login}': ['rate<0.05'],
    'http_req_failed{type:accounts}': ['rate<0.05'],
    'http_req_failed{type:prodcategory}': ['rate<0.05'],
    'checks{type:login}': ['rate>0.95'],
    'checks{type:accounts}': ['rate>0.95'],
    'checks{type:prodcategory}': ['rate>0.95'],
  },
};

const BASE_URL = 'http://3.132.157.35:8080/cen';
const loginUrl = `${BASE_URL}/CNSLOGIN/login`;
const accountsUrl = `${BASE_URL}/CNSACTSEL/accounts`;
const getProductCatUrl = `${BASE_URL}/CNSPROD/category/clubsets`;

export default function() {
  // 1️⃣ LOGIN
  const loginPayload = JSON.stringify({
    Email: 'harvey@lna.com',
    Password: 'lansa',
  });

  const loginHeaders = {
    'Accept-Language': 'en',
    'Content-Type': 'application/json',
  };

  const loginRes = http.post(loginUrl, loginPayload, {
    headers: loginHeaders,
    tags: { type: 'login' },
  });

  check(loginRes, {
    'login success': (r) => r.status === 200,
  });

  if (loginRes.status !== 200) {
    console.error(`❌ Login failed: ${loginRes.status} - ${loginRes.body}`);
    return;
  }

  // 2️⃣ EXTRACT TOKEN
  const token =
    loginRes.json('LW3ACSTKN') ||
    loginRes.json('access_token') ||
    loginRes.json('token') ||
    null;

  if (!token) {
    console.error('⚠️ No token returned — cannot continue');
    return;
  }

  const bearer = `Bearer ${token}`;
  const cookies = loginRes.cookies;

  // Convert cookie object to proper header string
  const cookieHeader = Object.entries(cookies)
    .map(([k, v]) => `${k}=${v[0].value}`)
    .join('; ');

  // 3️⃣ GET ACCOUNTS (optional)
  const accountsHeaders = {
    'Accept-Language': 'en',
    'Content-Type': 'text/plain',
    'Authorization': bearer,
    'Cookie': cookieHeader,
  };

  const accountsRes = http.get(accountsUrl, {
    headers: accountsHeaders,
    tags: { type: 'prodcategory' },
  });

  check(accountsRes, {
    'accounts success': (r) => r.status === 200,
  });

  if (accountsRes.status !== 200) {
    console.warn(`⚠️ Accounts request failed: ${accountsRes.status}`);
  }

  // (Optional) select account ID if backend expects it
//   const accountId = accountsRes.json('data[0].accountId');

    // 3️⃣ GET PRODUCT CATEGORY (clubsets)
  const categoryHeaders = {
    'Accept-Language': 'en',
    'Authorization': bearer,
    'Cookie': cookieHeader,
  };

  const categoryRes = http.get(getProductCatUrl, {
    headers: categoryHeaders,
    tags: { type: 'category' },
  });

  check(categoryRes, {
    'category success': (r) => r.status === 200,
  });

  if (categoryRes.status !== 200) {
    console.error(`⚠️ Category request failed: ${categoryRes.status} - ${categoryRes.body}`);
    return;
  }

  sleep(1);
}


// // save as smoke.js
// import http from 'k6/http';
// import { sleep } from 'k6';

// export const options = { vus: 1, iterations: 2 };

// export default function () {
//   http.get('https://test.k6.io');
//   sleep(1);
// }
