/** @format */

import Carousel from "@/components/Carousel";
import Faq from "@/components/Faq";
import FeatureCard from "@/components/FeatureCard";
import StartForFree from "@/components/StartForFree";
import { Button } from "@/components/ui/button";
import { faqs, features } from "@/constants";
import { ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen ">
      {/* Hero section */}
      <section className="container mx-auto py-40 text-center">
        <h1 className="text-6xl sm:text-7xl lg:text-8xl font-extrabold gradient-title pb-6 flex flex-col">
          Streamline Your Workflow
          <span className="flex mx-auto gap-3 md:gap-4 items-center">
            with
            <Image
              src="/logo2.png"
              alt="logo"
              height={80}
              width={400}
              className="h-14 sm:h-24 w-auto object-contain"
            />
          </span>
        </h1>
        <p className="text-xl text-gray-300  mb-10 max-w-3xl mx-auto">
          Empower your team with our intuitive project management solution.
        </p>
        <Link href={"/onboarding"}>
          <Button size="lg" className="mr-4">
            Get Started <ChevronRight />
          </Button>
        </Link>
        <Link href={"#features"}>
          <Button size="lg" variant="outline">
            Learn More
          </Button>
        </Link>
      </section>
      {/* Feature section */}
      <section id="features" className="bg-gray-900 py-20 px-5">
        <div className="container mx-auto">
          <h3 className="text-3xl font-bold mb-12 text-center">Key Features</h3>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {features.map((feature) => (
              <FeatureCard key={feature.title} feature={feature} />
            ))}
          </div>
        </div>
      </section>
      {/* Carousel section */}
      <section className="py-20 px-5">
        <div className="container mx-auto">
          <h3 className="text-3xl font-bold mb-12 text-center">
            Trusted by Industry Leaders
          </h3>
          <Carousel />
        </div>
      </section>
      {/* Faq section */}
      <section className="bg-gray-900 py-20 px-5">
        <div className="container mx-auto">
          <h3 className="text-3xl font-bold mb-12 text-center">
            Frequently Asked Questions{" "}
          </h3>
          {faqs.map((item, index) => (
            <Faq key={item.title} {...item} index={index} />
          ))}
        </div>
      </section>
      {/* Faq section */}
      <section className="py-20 px-5">
        <div className="container mx-auto">
          <h3 className="text-3xl font-bold mb-12 text-center">
            Ready to Transform Your Workflow?
          </h3>
          <StartForFree />
        </div>
      </section>
    </div>
  );
}
