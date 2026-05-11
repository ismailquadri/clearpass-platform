#!/usr/bin

/**
 * Generate secure random strings for JWT secrets and other environment variables
 */

import crypto from 'crypto';

function generateSecret(length = 32) {
  return crypto.randomBytes(length).toString('hex');
}

console.log('🔐 ClearPass Environment Secrets Generator');
console.log('==========================================\n');

console.log('JWT_SECRET=' + generateSecret(32));
console.log('JWT_REFRESH_SECRET=' + generateSecret(32));
console.log('SESSION_SECRET=' + generateSecret(32));
console.log('ENCRYPTION_KEY=' + generateSecret(32));
console.log('\n✅ Copy these to your Railway environment variables');
console.log('⚠️  Store these securely - they are critical for production security');