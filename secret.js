/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable prettier/prettier */
const crypto = require('crypto');
const secretKey = crypto.randomBytes(32).toString('hex'); // Generate a 256-bit (32-byte) secret key
console.log('Secret Key:', secretKey);