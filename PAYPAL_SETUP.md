# PayPal Integration Setup

This document explains how to set up PayPal integration alongside the existing Stripe integration.

## Environment Variables Required

Add the following environment variables to your `.env.local` file:

```bash
# PayPal Configuration
PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_CLIENT_SECRET=your_paypal_client_secret
NEXT_PUBLIC_PAYPAL_CLIENT_ID=your_paypal_client_id

# Existing Stripe Configuration (keep these)
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

## Getting PayPal Credentials

1. Go to [PayPal Developer Portal](https://developer.paypal.com/)
2. Create a developer account or log in
3. Navigate to "My Apps & Credentials"
4. Create a new app or use an existing one
5. Copy the Client ID and Client Secret
6. For production, make sure to use the Live credentials instead of Sandbox

## Features Added

### 1. Database Schema Updates

- Added `PaymentMethod` enum (stripe, paypal)
- Added PayPal fields to `Transaction` model:
  - `paypalOrderId`
  - `paypalCaptureId`
  - `paymentMethod`
- Added PayPal fields to `Order` model:
  - `paypalOrderId`
  - `paymentMethod`

### 2. New API Endpoints

- `/api/create-paypal-order` - Creates PayPal orders
- `/api/capture-paypal-order` - Captures PayPal payments

### 3. Updated Components

- New `CheckoutForm` component supporting both Stripe and PayPal
- Payment method selection (radio buttons)
- Conditional rendering of payment forms

### 4. Updated Order Processing

- Modified `/api/orders` to handle both payment methods
- Updated transaction creation for PayPal payments

## How It Works

1. **Payment Method Selection**: Users can choose between Stripe (credit card) and PayPal
2. **Stripe Flow**:
   - Creates payment intent
   - Processes card payment
   - Creates order with Stripe payment details
3. **PayPal Flow**:
   - Creates PayPal order
   - User approves payment on PayPal
   - Captures payment
   - Creates order with PayPal payment details

## Testing

- Use PayPal Sandbox for testing
- Test both payment methods thoroughly
- Verify order creation and transaction recording
- Check that both payment methods create valid orders

## Security Notes

- PayPal credentials are stored server-side only
- Client-side only receives the public client ID
- All payment processing happens server-side
- Payment validation occurs before order creation

