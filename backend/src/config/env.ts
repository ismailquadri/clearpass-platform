import 'dotenv/config';

function getOptional(name: string, fallback = ''): string {
  return process.env[name] ?? fallback;
}

export const env = {
  nodeEnv: getOptional('NODE_ENV', 'development') as 'development' | 'test' | 'production',
  port: Number(getOptional('PORT', '5000')),
  isProduction: process.env.NODE_ENV === 'production',
  isDevelopment: process.env.NODE_ENV !== 'production',

  // JWT
  jwtSecret: getOptional('JWT_SECRET', 'dev-secret-change-in-production'),
  jwtExpiresIn: getOptional('JWT_EXPIRES_IN', '24h'),
  jwtRefreshSecret: getOptional('JWT_REFRESH_SECRET', 'dev-refresh-secret-change-in-production'),
  jwtRefreshExpiresIn: getOptional('JWT_REFRESH_EXPIRES_IN', '30d'),

  // CORS
  frontendUrl: getOptional('FRONTEND_URL', 'http://localhost:5173'),

  // Paystack
  paystackSecretKey: getOptional('PAYSTACK_SECRET_KEY'),
  paystackPublicKey: getOptional('PAYSTACK_PUBLIC_KEY'),
  paystackWebhookSecret: getOptional('PAYSTACK_WEBHOOK_SECRET'),

  // S3
  s3Bucket: getOptional('S3_BUCKET', 'clearpass-documents'),
  s3Region: getOptional('S3_REGION', 'us-east-1'),
  s3AccessKeyId: getOptional('S3_ACCESS_KEY_ID'),
  s3SecretAccessKey: getOptional('S3_SECRET_ACCESS_KEY'),
  s3Endpoint: getOptional('S3_ENDPOINT'),

  // Email
  postmarkToken: getOptional('POSTMARK_SERVER_TOKEN'),
  emailFrom: getOptional('EMAIL_FROM', 'noreply@clearpass.com.ng'),
  emailFromName: getOptional('EMAIL_FROM_NAME', 'ClearPass'),

  // Government APIs
  nhiaApiUrl: getOptional('NHIA_API_URL'),
  nhiaApiKey: getOptional('NHIA_API_KEY'),
  cacApiUrl: getOptional('CAC_API_URL'),
  cacApiKey: getOptional('CAC_API_KEY'),
  firsApiUrl: getOptional('FIRS_API_URL'),
  firsApiKey: getOptional('FIRS_API_KEY'),
  pencomApiUrl: getOptional('PENCOM_API_URL'),
  pencomApiKey: getOptional('PENCOM_API_KEY'),
  bppApiUrl: getOptional('BPP_API_URL'),
  bppApiKey: getOptional('BPP_API_KEY'),

  // Logging
  logLevel: getOptional('LOG_LEVEL', 'info'),
} as const;
