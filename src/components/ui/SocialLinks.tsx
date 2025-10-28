import React from "react";
import { SvgFacebook, SvgInstagram, SvgTwitter } from "@/assets/svg";

const SocialLinks = () => {
  return (
    <div>
      <div className="w-full flex items-center justify-end gap-3 text-sm lg:text-base">
        <h4 className="font-medium text-gray01 dark:text-gray-400">
          Share Item:
        </h4>
        <div className="social-links">
          <SvgFacebook className="dark:text-gray-400" />
        </div>
        <div className="social-links">
          <SvgInstagram className="dark:text-gray-400" />
        </div>
        <div className="social-links">
          <SvgTwitter className="dark:text-gray-400" />
        </div>
      </div>
    </div>
  );
};

export default SocialLinks;
