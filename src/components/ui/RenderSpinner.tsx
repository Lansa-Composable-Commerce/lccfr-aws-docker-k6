import React from "react";
import { SvgSpinner } from "@/assets/svg";

const RenderSpinner = () => {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <SvgSpinner />
    </div>
  );
};

export default RenderSpinner;
