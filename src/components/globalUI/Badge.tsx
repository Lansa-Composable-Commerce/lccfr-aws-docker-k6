import React from "react";

const Badge = ({ content }: { content: string }) => {
  return (
    <span className="w-auto bg-brand/20 text-brand p-1 px-2 rounded-md text-sm">
      {content}
    </span>
  );
};

export default Badge;
