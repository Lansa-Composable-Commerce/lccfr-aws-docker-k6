import React from "react";
import classNames from "classnames";

interface CardProps {
  children: React.ReactNode;
  onClick?: () => void;
  cn?: string;
}

const Card = ({ children, onClick, cn }: CardProps) => {
  return (
    <div className={classNames("card", cn)} onClick={onClick}>
      {children}
    </div>
  );
};

export default Card;
