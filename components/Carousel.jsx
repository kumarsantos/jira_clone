/** @format */
"use client";
import React from "react";
import { Carousel, CarouselContent, CarouselItem } from "./ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { companiesData } from "@/constants";
import Image from "next/image";
const CompanyCarousel = () => {
  return (
    <Carousel
      plugins={[
        Autoplay({
          delay: 2000,
        }),
      ]}
      className="w-full py-10"
    >
      <CarouselContent className="flex gap-5 sm:gap-20 items-center">
        {companiesData?.map((item) => {
          return (
            <CarouselItem key={item.id} className="basis-1/3 lg:basis-1/6">
              <Image
                src={item.path}
                alt={item.name}
                height={56}
                width={200}
                className="h-9 lg:h-14 w-auto object-contain"
              />
            </CarouselItem>
          )
        })}
      </CarouselContent>
    </Carousel>
  );
};

export default CompanyCarousel;
