"use client"
import { lato, orbitron, poppins } from "@/fonts/fonts";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "@/components/CheckoutForm";

export default function Checkout() {
  const stripePromise = loadStripe("pk_test_51R9i482MRcnSBYc7PUCHKjITMA5QX0BD7EVBYSk4OmNWTIP54WlHjVhdb9DMn9W91CShSzAw6SDVUDVQ8CBrrtyc00CHyToDDu"); // Replace with your Stripe public key

  return (
    <div className="Checkout p-8 max-w-[1300px] justify-between mx-auto w-full ">
      <div className="flex items-center xs:gap-14 gap-4 ">
        <img width={"40px"} src="/images/leftarrow.png" alt="back icon" />
        <h2
          className={`uppercase text-[40px] ${orbitron.className} font-bold text-3xl`}
        >
          Diffed.gg
        </h2>
      </div>

      <div className="w-full lg:grid lg:grid-cols-2">
        <div className="data mt-20">
          {/* card for package info */}
          <div
            className="card w-full mx-auto xl:w-[90%] rounded-lg min-h-[370px] overflow-hidden relative pl-5"
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "2px solid rgba(255,255,255,0.15)",
            }}
          >
            <img
              className="absolute top-0 -right-34 -z-1 sm:-right-18  h-[300px] object-cover"
              src="/images/checkoutimage.png"
              alt="Checkout"
            />
            <div className="mt-16">
              <h3
                className={`bg-gradient-to-r uppercase font-bold text-[27px] inline from-[#EE2C81] via-[#FE0FD0] to-[#58B9E3] bg-clip-text text-transparent tracking-wide leading-tight ${orbitron.className}`}
              >
                Valorant
              </h3>
              <h3
                className={`${orbitron.className} uppercase text-[27px] text-white font-bold tracking-wide leading-tight`}
              >
                Subscription
              </h3>
            </div>
            <ul
              className={`benifits mt-5 text-[24px] list-disc list-inside ${lato.className} font-[400]`}
              style={{ lineHeight: "200%" }}
            >
              <li>3-Hour Coaching</li>
              <li>Duo Queue</li>
            </ul>
          </div>

          {/* Price breakdown info */}
          <div className="sm:pl-6 text-[24px] mt-12">
            <h4 className="mb-6">Price Breakdown:</h4>
            <div className="flex justify-between w-[20rem]">
              <ul className="pl-5 list-disc" style={{ lineHeight: "230%" }}>
                <li>Base Service:</li>
                <li>Add-Ons:</li>
                <li>Total:</li>
              </ul>
              <ul style={{ lineHeight: "230%" }}>
                <li>$25</li>
                <li>$10</li>
                <li>$35</li>
              </ul>
            </div>
          </div>
        </div>
        <form className="form mt-20 lg:mt-0 lg:ml-20 lg:justify-self-start xl:justify-self-end ">
          <Elements stripe={stripePromise}>
         <CheckoutForm />
       </Elements>
        </form>
      </div>
    </div>
  );
}
