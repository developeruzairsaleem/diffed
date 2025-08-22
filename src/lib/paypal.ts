import paypal from "@paypal/paypal-server-sdk";

// Configure PayPal environment
const environment =
  process.env.NODE_ENV === "production"
    ? new paypal.core.LiveEnvironment(
        process.env.PAYPAL_CLIENT_ID!,
        process.env.PAYPAL_CLIENT_SECRET!
      )
    : new paypal.core.SandboxEnvironment(
        process.env.PAYPAL_CLIENT_ID!,
        process.env.PAYPAL_CLIENT_SECRET!
      );

export const paypalClient = new paypal.core.PayPalHttpClient(environment);

export const formatAmountForPayPal = (amount: number): string => {
  return amount.toFixed(2);
};

export const formatAmountFromPayPal = (amount: string): number => {
  return parseFloat(amount);
};

