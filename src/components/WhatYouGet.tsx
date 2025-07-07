export default function WhatYouGet() {
  const benifits = [
    "1-on-1 with Immortal Coach",
    "Custom strategies tailored to your playstyle",
    " Fast rank progression",
    "VOD reviews and live feedback   ",
  ];
  return (
    <div className="what_you_get pb-30 pt-50">
      <h2
        style={{ display: "block" }}
        className="gradient-text mx-auto text-center flex justify-center"
      >
        <span className="gradient-text mr-4">WHAT</span>
        <span style={{ color: "white" }}>YOU GET</span>
      </h2>

      <div className="main_container flex flex-col mx-auto my-8 max-w-xl w-full">
        {benifits.map((item, idx) => (
          <div
            key={idx}
            className="flex border border-purple-700  px-7 py-5 items-center gap-5 rounded-lg my-4"
            style={{ backgroundColor: "rgba(200,150,255,0.15)" }}
          >
            <img src="/images/tick.png" alt="check" />
            <span style={{ fontSize: "1rem" }}>{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
