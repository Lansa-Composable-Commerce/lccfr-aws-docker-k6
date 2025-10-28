"use client";

import { ReactNode } from "react";
import { Swiper as SwiperComponent } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

type SwiperPropType = {
  children: ReactNode;
};

export default function Swiper({ children }: SwiperPropType) {
  return (
    <SwiperComponent
      loop={true}
      autoplay={{
        delay: 2500,
        disableOnInteraction: false,
      }}
      pagination={{
        dynamicBullets: true,
      }}
      // navigation={true}
      modules={[Autoplay, Pagination, Navigation]}
      className="mySwiper z-0"
    >
      {children}
    </SwiperComponent>
  );
}
