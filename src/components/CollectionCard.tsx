import React from "react";
import Image from "next/image";

const CollectionCard = ({ collection }: any) => {
  return (
    <div className="collection-card relative">
      <div className="w-full h-full">
        <Image
          src={collection.img}
          width={298}
          height={435}
          className="w-full h-full"
          alt="product-card"
        />
      </div>

      <div className="absolute m-auto bottom-8 md:bottom-6 left-0 right-0 max-w-[7.5rem]">
        <div className="flex items-center bg-white03 w-full py-2 px-2.5 lg:py-3 lg:px-5 border border-white02 rounded-lg">
          <h4 className="text-center w-full uppercase font-semibold text-xs">
            {collection.title}
          </h4>
        </div>
      </div>
    </div>
  );
};

export default CollectionCard;
