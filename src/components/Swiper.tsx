"use client";

import React from "react";
import Image from "next/image";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

// import required modules
import { Autoplay, Pagination } from "swiper/modules";
import Button from "@/components/globalUI/Button";
import { SvgArrowRight } from "@/assets/svg";

export default function MainSwiper() {
  return (
    <Swiper
      loop={true}
      autoplay={{
        delay: 2500,
        disableOnInteraction: false,
      }}
      pagination={{
        dynamicBullets: true,
      }}
      modules={[Autoplay, Pagination]}
      className="mySwiper z-0"
    >
      <SwiperSlide>
        <div className="w-full h-full flex md:items-center justify-center bg-gradient-to-r from-white to-lightGreen">
          <div className="container mx-auto px-4 py-20 h-full lg:h-[640px]">
            <div className="grid sm:grid-cols-3 place-items-center gap-5 w-full h-full">
              <div className="sm:col-span-2 w-full flex flex-col gap-y-6 lg:gap-y-10 items-start justify-center lg:ml-24">
                <div className="text-left text-black01">
                  <p className="text-base">Welcome to chipshot</p>
                  <p className="text-3xl md:text-4xl lg:text-5xl text-left font-semibold">
                    Lorem Ipsum & Lorem Ipsum
                  </p>
                </div>

                <div className="flex flex-col text-base text-left text-gray01">
                  <p className="text-black01 text-xl md:text-2xl lg:text-3xl">
                    Sale up to <span className="text-orange-600">30% OFF</span>
                  </p>
                  <span>
                    Free shipping on all your order. we deliver, you enjoy
                  </span>
                </div>
                <div>
                  <Button size="lg" className="rounded-lg w-full px-4">
                    <div className="flex items-center gap-x-1.5">
                      <span>Shop now</span>
                      <SvgArrowRight />
                    </div>
                  </Button>
                </div>
              </div>

              <div className="relative w-full h-auto">
                <Image
                  src="/sample-image-9.jpg"
                  width={400}
                  height={400}
                  alt="sampleImage9"
                  priority={true}
                />
              </div>
            </div>
          </div>
        </div>
      </SwiperSlide>
      <SwiperSlide>
        <div className="w-full h-full flex md:items-center justify-center bg-gradient-to-r from-white to-blue-100">
          <div className="container mx-auto px-4 py-20 h-full lg:h-[640px]">
            <div className="grid sm:grid-cols-3 place-items-center gap-5 w-full h-full">
              <div className="sm:col-span-2 w-full flex flex-col gap-y-6 lg:gap-y-10 items-start justify-center lg:ml-24">
                <div className="text-left text-black01">
                  <p className="text-base">Welcome to chipshot</p>
                  <p className="text-3xl md:text-4xl lg:text-5xl text-left font-semibold">
                    Lorem Ipsum & Lorem Ipsum
                  </p>
                </div>

                <div className="flex flex-col text-base text-left text-gray01">
                  <p className="text-black01 text-xl md:text-2xl lg:text-3xl">
                    Sale up to <span className="text-[#FF8A00]">30% OFF</span>
                  </p>
                  <span>
                    Free shipping on all your order. we deliver, you enjoy
                  </span>
                </div>
                <div>
                  <Button size="lg" className="rounded-lg w-full px-4">
                    <div className="flex items-center gap-x-1.5">
                      <span>Shop now</span>
                      <SvgArrowRight />
                    </div>
                  </Button>
                </div>
              </div>

              <div className="relative w-full h-auto">
                <Image
                  src="/sample-image-9.jpg"
                  width={400}
                  height={400}
                  alt="sampleImage9"
                  priority={true}
                />
              </div>
            </div>
          </div>
        </div>
      </SwiperSlide>
      <SwiperSlide>
        <div className="w-full h-full flex md:items-center justify-center  bg-gradient-to-r from-white to-slate-300">
          <div className="container mx-auto px-4 py-20 h-full lg:h-[640px]">
            <div className="grid sm:grid-cols-3 place-items-center gap-5 w-full h-full">
              <div className="sm:col-span-2 w-full flex flex-col gap-y-6 lg:gap-y-10 items-start justify-center lg:ml-24">
                <div className="text-left text-black01">
                  <p className="text-base">Welcome to chipshot</p>
                  <p className="text-3xl md:text-4xl lg:text-5xl text-left font-semibold">
                    Lorem Ipsum & Lorem Ipsum
                  </p>
                </div>

                <div className="flex flex-col text-base text-left text-gray01">
                  <p className="text-black01 text-xl md:text-2xl lg:text-3xl">
                    Sale up to <span className="text-[#FF8A00]">30% OFF</span>
                  </p>
                  <span>
                    Free shipping on all your order. we deliver, you enjoy
                  </span>
                </div>
                <div>
                  <Button size="lg" className="rounded-lg w-full px-4">
                    <div className="flex items-center gap-x-1.5">
                      <span>Shop now</span>
                      <SvgArrowRight />
                    </div>
                  </Button>
                </div>
              </div>

              <div className="relative w-full h-auto">
                <Image
                  src="/sample-image-9.jpg"
                  width={400}
                  height={400}
                  alt="sampleImage9"
                  priority={true}
                />
              </div>
            </div>
          </div>
        </div>
      </SwiperSlide>
    </Swiper>
  );
}
