import { createTokenBucketLimiter, expressRateLimiter } from '@backend-suite/rate-limiter';
import express from 'express';

const app = express();
const limiter = createTokenBucketLimiter({ tokensPerInterval: 10, interval: 'minute' });

app.use(expressRateLimiter({ limiter }));

app.get('/', (req, res) => {
  res.send('Hello, world!');
});

app.listen(3000); 