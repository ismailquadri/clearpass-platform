import { Router } from 'express';
import { paymentService } from '../services/payment';
import type { SuccessResponse } from '../types';

const router = Router();

// POST /api/webhooks/paystack
router.post('/paystack', async (req, res, next) => {
  try {
    // In production, verify webhook signature
    // const expectedSignature = crypto
    //   .createHmac('sha512', env.paystackWebhookSecret)
    //   .update(JSON.stringify(req.body))
    //   .digest('hex');
    // 
    // if (signature !== expectedSignature) {
    //   throw new AppError('INVALID_SIGNATURE', 'Invalid webhook signature', 401);
    // }

    const event = req.body.event;
    const data = req.body.data;

    // Handle different event types
    switch (event) {
      case 'charge.success':
        await paymentService.handleWebhook({ event, data });
        break;
      
      case 'charge.failed':
        await paymentService.handleWebhook({ event, data });
        break;
      
      case 'invoice.create':
        // Handle invoice creation
        break;
      
      case 'invoice.payment_failed':
        // Handle failed invoice payment
        break;
      
      case 'subscription.create':
        // Handle subscription creation
        break;
      
      case 'subscription.disable':
        // Handle subscription cancellation
        break;
      
      default:
        console.log(`Unhandled webhook event: ${event}`);
    }

    const response: SuccessResponse = {
      success: true,
      data: { message: 'Webhook processed successfully' },
      meta: {
        timestamp: new Date().toISOString(),
      },
    };

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
});

export default router;