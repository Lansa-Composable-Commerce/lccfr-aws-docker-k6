import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 5, // number of virtual users
  duration: '10s', // test duration
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% of requests should be <500ms
  },
};

export default function () {
  const res = http.get('https://google.com');
  check(res, {
    'status is 200': (r) => r.status === 200,
  });
  sleep(1);
}

