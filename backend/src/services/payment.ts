import { db } from '../config/database';
import { PLAN_PRICES } from '../config/constants';
import { v4 as uuidv4 } from 'uuid';

export interface InitializePaymentInput {
  email: string;
  amount: number; // in kobo
  tier: string;
  companyId: string;
  billingCycle: 'monthly' | 'annual';
}

export interface PaymentResponse {
  authorization_url: string;
  access_code: string;
  reference: string;
}

export interface VerifyPaymentInput {
  reference: string;
}

export interface VerifyPaymentResponse {
  status: 'success' | 'failed';
  message: string;
  data?: {
    amount: number;
    currency: string;
    transaction_date: string;
    reference: string;
  };
}

export class PaymentService {
  private mockTransactions: Map<string, {
    amount: number;
    tier: string;
    companyId: string;
    billingCycle: 'monthly' | 'annual';
    email: string;
    status: 'pending' | 'success' | 'failed';
    createdAt: Date;
  }> = new Map();

  async initializePayment(input: InitializePaymentInput): Promise<PaymentResponse> {
    const reference = `mock_${uuidv4()}`;
    const access_code = uuidv4().replace(/-/g, '').substring(0, 20);

    // Store mock transaction
    this.mockTransactions.set(reference, {
      amount: input.amount,
      tier: input.tier,
      companyId: input.companyId,
      billingCycle: input.billingCycle,
      email: input.email,
      status: 'pending',
      createdAt: new Date(),
    });

    // Return mock payment URL (in production, this would be actual Paystack URL)
    return {
      authorization_url: `https://mock-paystack.com/pay/${access_code}`,
      access_code,
      reference,
    };
  }

  async verifyPayment(input: VerifyPaymentInput): Promise<VerifyPaymentResponse> {
    const transaction = this.mockTransactions.get(input.reference);

    if (!transaction) {
      return {
        status: 'failed',
        message: 'Transaction not found',
      };
    }

    // Mock successful payment verification
    transaction.status = 'success';
    this.mockTransactions.set(input.reference, transaction);

    // Create or update subscription
    await this.createOrUpdateSubscription(transaction);

    return {
      status: 'success',
      message: 'Payment successful',
      data: {
        amount: transaction.amount,
        currency: 'NGN',
        transaction_date: new Date().toISOString(),
        reference: input.reference,
      },
    };
  }

  async handleWebhook(payload: any): Promise<void> {
    // Mock webhook handling
    const { event, data } = payload;

    if (event === 'charge.success') {
      const reference = data.reference;
      const transaction = this.mockTransactions.get(reference);

      if (transaction) {
        transaction.status = 'success';
        this.mockTransactions.set(reference, transaction);
        await this.createOrUpdateSubscription(transaction);
      }
    } else if (event === 'charge.failed') {
      const reference = data.reference;
      const transaction = this.mockTransactions.get(reference);

      if (transaction) {
        transaction.status = 'failed';
        this.mockTransactions.set(reference, transaction);
      }
    }
  }

  private async createOrUpdateSubscription(transaction: any): Promise<void> {
    const { tier, companyId, billingCycle, amount } = transaction;

    const prices = PLAN_PRICES[tier as keyof typeof PLAN_PRICES];
    const monthlyAmount = billingCycle === 'monthly' ? amount : prices.annual / 12;
    const annualAmount = billingCycle === 'annual' ? amount : prices.monthly * 12;

    const existing = await db('subscriptions')
      .where({ company_id: companyId })
      .first();

    const subscriptionData = {
      company_id: companyId,
      tier,
      monthly_amount: monthlyAmount,
      annual_amount: annualAmount,
      billing_cycle: billingCycle,
      paystack_customer_code: `mock_customer_${uuidv4()}`,
      paystack_authorization_code: `mock_auth_${uuidv4()}`,
      last_payment_reference: uuidv4(),
      last_payment_date: new Date(),
      next_billing_date: new Date(Date.now() + (billingCycle === 'monthly' ? 30 : 365) * 24 * 60 * 60 * 1000),
      status: 'active',
    };

    if (existing) {
      await db('subscriptions')
        .where({ company_id: companyId })
        .update({
          ...subscriptionData,
          updated_at: new Date(),
        });
    } else {
      await db('subscriptions').insert({
        ...subscriptionData,
        started_at: new Date(),
      });
    }
  }

  async cancelSubscription(companyId: string): Promise<void> {
    await db('subscriptions')
      .where({ company_id: companyId })
      .update({
        status: 'cancelled',
        ended_at: new Date(),
        updated_at: new Date(),
      });
  }

  async getSubscription(companyId: string) {
    return await db('subscriptions')
      .where({ company_id: companyId })
      .first();
  }

  async calculatePrice(tier: string, billingCycle: 'monthly' | 'annual'): Promise<number> {
    const prices = PLAN_PRICES[tier as keyof typeof PLAN_PRICES];
    return billingCycle === 'monthly' ? prices.monthly : prices.annual;
  }
}

export const paymentService = new PaymentService();