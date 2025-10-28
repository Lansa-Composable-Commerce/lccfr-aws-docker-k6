import React from "react";
import Card from "@/components/ui/Card";

const AccountSettingCard = ({
  id,
  title,
  children,
  btn,
}: {
  id?: string;
  title?: string;
  children: React.ReactNode;
  btn?: any;
}) => {
  return (
    <Card>
      {title && (
        <div id={id} className="flex items-center justify-between">
          <span className="capitalize text-sm md:text-base lg:text-lg font-medium">
            {title}
          </span>
          {btn}
        </div>
      )}

      {title && title.length > 0 && <hr className="w-full my-1.5 sm:my-3" />}

      {children}
    </Card>
  );
};

export default AccountSettingCard;
