import http from 'k6/http';
import { sleep, check } from 'k6';

export const options = {
  vus: 5,            // 5 virtual users
  duration: '10s',   // for 10 seconds
  thresholds: {
    http_req_failed: ['rate<0.01'],  // less than 1% of requests should fail
    http_req_duration: ['p(95)<500'], // 95% of requests should be < 500ms
  },
};

export default function () {
  const res = http.get('https://lccfr-v2-alb-1240804052.us-east-2.elb.amazonaws.com/api/health');

  check(res, {
    'status is 200': (r) => r.status === 200,
    'response time < 500ms': (r) => r.timings.duration < 500,
  });

  sleep(1);
}
