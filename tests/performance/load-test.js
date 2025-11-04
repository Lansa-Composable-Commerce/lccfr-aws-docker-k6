import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 5,
  duration: '20s',
  thresholds: {
    'http_req_failed{type:login}': ['rate<0.05'],     // <5% login failures
    'http_req_failed{type:accounts}': ['rate<0.05'],  // <5% accounts failures
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
  };

  const loginRes = http.post(loginUrl, loginPayload, { headers: loginHeaders, tags: { type: 'login' } });

  check(loginRes, {
    'login status is 200': (r) => r.status === 200,
    'login returned token': (r) => r.json('access_token') !== undefined || r.json('token') !== undefined,
  });

  if (loginRes.status !== 200) {
    console.error(`❌ Login failed: ${loginRes.status} - ${loginRes.body}`);
    return;
  }

  // 2️⃣ EXTRACT TOKEN FROM RESPONSE
  const token = loginRes.json('access_token') || loginRes.json('token');
  if (!token) {
    console.error('❌ No token found in login response.');
    return;
  }

  // 3️⃣ GET ACCOUNTS REQUEST
  const accountsUrl = 'http://3.132.157.35:8080/cen/CNSACTSEL/accounts';
  const accountsHeaders = {
    'Accept-Language': 'en',
    'Content-Type': 'text/plain',
    'Authorization': `Bearer ${token}`,
  };

  const accountsRes = http.get(accountsUrl, { headers: accountsHeaders, tags: { type: 'accounts' } });

  check(accountsRes, {
    'accounts status is 200': (r) => r.status === 200,
    'accounts returned body': (r) => r.body && r.body.length > 0,
  });

  if (accountsRes.status !== 200) {
    console.error(`❌ Accounts request failed: ${accountsRes.status} - ${accountsRes.body}`);
  }

  // 4️⃣ Simulate user wait time
  sleep(1);
}
