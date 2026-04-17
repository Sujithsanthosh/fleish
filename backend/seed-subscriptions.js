const http = require('http');

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/subscriptions/seed',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
};

const req = http.request(options, (res) => {
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    console.log('Seed response:', data);
  });
});

req.on('error', (error) => {
  console.error('Seed error (Is the backend running?):', error.message);
});

req.end();
