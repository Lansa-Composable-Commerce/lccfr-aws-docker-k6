import Image from "next/image";
import emptyResult from "@/assets/svg/empty.svg";
import { ReactNode } from "react";

export default function EmptyPlaceholder({
  children,
  imageStyle,
}: {
  children?: ReactNode;
  imageStyle?: string;
}) {
  return (
    <div className="w-full p-6 flex flex-col items-center justify-center gap-4">
      <Image
        className={`${imageStyle} md:w-full max-w-sm`}
        width={200}
        height={200}
        src={emptyResult}
        alt="empty_result"
        priority={true}
      />
      {children}
    </div>
  );
}
