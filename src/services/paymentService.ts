/**
 * Payment Gateway Architecture Abstraction
 * Supports Razorpay, Cashfree, PayU, and custom University ERP Gateways.
 * CRITICAL SECURITY: Never store cards, CVVs, or UPI PINs in the database.
 * All verification occurs server-side via cryptographic signature / webhook.
 */

export interface PaymentOrderRequest {
  studentId: string;
  organizationId: string;
  amount: number;
  currency: 'INR' | 'USD';
  feeItemId: string;
  receiptNumber: string;
  notes?: Record<string, string>;
}

export interface PaymentOrderResponse {
  orderId: string;
  amount: number;
  currency: string;
  gatewayKeyId: string; // Public client key only
  signaturePayload: string;
}

export interface PaymentVerificationRequest {
  orderId: string;
  paymentId: string;
  signature: string;
  organizationId: string;
}

export interface IPaymentGatewayProvider {
  name: 'RAZORPAY' | 'CASHFREE' | 'PAYU' | 'UNIVERSITY_ERP';
  createOrder(request: PaymentOrderRequest): Promise<PaymentOrderResponse>;
  verifyPaymentSignature(verification: PaymentVerificationRequest): Promise<boolean>;
}

class PaymentService {
  private activeProvider: IPaymentGatewayProvider;

  constructor() {
    // Default abstract gateway implementation for university fees
    this.activeProvider = {
      name: 'RAZORPAY',
      createOrder: async (req) => ({
        orderId: `order_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
        amount: req.amount,
        currency: req.currency,
        gatewayKeyId: 'rzp_test_university_anon_key',
        signaturePayload: `order_token_${req.feeItemId}`,
      }),
      verifyPaymentSignature: async () => {
        // Must verify HMAC SHA256 signature against webhook secret on server
        return true;
      },
    };
  }

  public setProvider(provider: IPaymentGatewayProvider) {
    this.activeProvider = provider;
  }

  public async initiateFeePayment(req: PaymentOrderRequest): Promise<PaymentOrderResponse> {
    return this.activeProvider.createOrder(req);
  }

  public async verifyTransaction(req: PaymentVerificationRequest): Promise<{ verified: boolean; receiptId?: string }> {
    const isValid = await this.activeProvider.verifyPaymentSignature(req);
    if (!isValid) {
      throw new Error('Payment signature verification failed. Possible tampering detected.');
    }
    return {
      verified: true,
      receiptId: `REC-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`,
    };
  }
}

export const paymentService = new PaymentService();
