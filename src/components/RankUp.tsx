"use client";
import { lato, orbitron } from "@/fonts/fonts";
import { useRouter } from "next/navigation";
import Link from "next/link";
export default function RankUp() {
  const router = useRouter();
  return (
    <div className="">
      <h2
        style={{ display: "flex", justifyContent: "center" }}
        className="gradient-text "
      >
        <div className="gradient-text my-5">READY TO</div>
      </h2>

      <h2
        style={{ display: "flex", justifyContent: "center" }}
        className="gradient-text "
      >
        <div style={{ color: "white" }} className="gradient-text">
          RANK UP
        </div>
      </h2>

      <p className={`text-center ${lato.className} my-10 text-[1.7rem] mb-24`}>
        Get coached by top-tier pros and climb ranks faster!
      </p>
      <div className="flex justify-center mb-12">
        <button
          onClick={() => router.push("/login")}
          className={` ${orbitron.className} relative mx-auto inline-block cursor-pointer group`}
        >
          <div
            className={`
          
            bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-400
            transform -skew-x-12
            
           
            px-12 py-4
            transition-all duration-300 ease-out
            hover:scale-105
          `}
          >
            <Link
              href="/checkout"
              className="flex items-center justify-center h-full p-0.5 transform skew-x-12"
            >
              <span className="text-white text-lg font-bold tracking-wider">
                CONTINUE TO
                <div>CHECKOUT</div>
              </span>
            </Link>
          </div>
        </button>
      </div>

      <p
        className={`text-center ${lato.className} my-10 mb-40   text-[1.7rem] mb-12`}
      >
        Secure Payment • 24/7 Support • 100% Safe
      </p>
    </div>
  );
}
