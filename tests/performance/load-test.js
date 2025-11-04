import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  // adjust to your needs: vus/duration or stages
  vus: 5,
  duration: '20s',
  // thresholds (optional) — fail if too many non-200s
  thresholds: {
    'http_req_failed{type:login}': ['rate<0.05'], // <5% failures
  },
};

export default function () {
  const url = 'http://3.132.157.35:8080/cen/CNSLOGIN/login';

  const payload = JSON.stringify({
    Email: 'harvey@lna.com',
    Password: 'lansa',
  });

  const headers = {
    'Accept-Language': 'en',
    'Content-Type': 'application/json',
    // You can set the cookie header directly like this:
    'Cookie': 'ce_ac_token=eyJhbGciOiJIUzM4NCIsInR5cCI6IkpXVCJ9.eyJ4dHJhcyI6eyJjZUdVSUQiOiIzYTMwNzkxZDJlZGIxOWFmY2I2MzZlY2Q0YzQzMmFkNjFkNDliYTIzMDAzZGY3MjAxNTY2ODAxODBiNDFkOTAxIiwiY2VVc2VyTmFtZSI6ImhhcnZleSIsImNlRW1haWwiOiJoYXJ2ZXlAbG5hLmNvbSIsImNlRmlyc3ROYW1lIjoiSGFydmV5IiwiY2VMYXN0TmFtZSI6IldhbGxiYW5nZXIifSwiaWF0IjoxNzYyMjI3NDcwLCJleHAiOjE3NjIyMjgwNzB9.SXzgguvj_0DFN9TRTt74ZSkOGJwH6No885Ul4Jzdow9crQT4yriCzNFLrkLhMU4B; ce_rf_token=eyJhbGciOiJIUzM4NCIsInR5cCI6IkpXVCJ9.eyJ4dHJhcyI6e30sImlhdCI6MTc2MjIyNzQ3MCwiZXhwIjoxNzY0ODE5NDcwfQ.c3t0aNh9dcvi7ZfnumTjn9fAjwDludTyknDAK5WP5GSM7lzRMesf-41ZLbwT0Fv'
  };

  const res = http.post(url, payload, { headers, tags: { type: 'login' } });

  check(res, {
    'status is 200': (r) => r.status === 200,
    'returns token or success': (r) => r.body && r.body.length > 0,
  });

  // small sleep to emulate user think time
  sleep(1);
}
