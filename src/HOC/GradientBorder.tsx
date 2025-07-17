import React from "react";
export default function GradientBorder({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className={` rounded-lg my-6`}
      style={{
        padding: "2px",
        background:
          "linear-gradient(90deg, #EE2C81 0%, #FE0FD0 33%, #58B9E3 66%, #F79FC5 100%)",
      }}
    >
      <div
        style={{
          padding: "1px",
          background:
            "linear-gradient(90deg, #EE2C81 0%, #FE0FD0 33%, #58B9E3 66%, #F79FC5 100%)",
        }}
        className="h-full rounded-lg"
      >
        {children}
        <div className="rounded-lg  bg-[#b31d7c]">{children}</div>
      </div>
    </div>
  );
}
