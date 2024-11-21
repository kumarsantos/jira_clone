import React from "react";
import { Button } from "./ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

const StartForFree = () => {
  return (
    <div className="w-full text-center">
      <p className=" text-xl mb-12">
        Join thousands of teams already using ZCRUM to streamline their projects
        and boost productivity.
      </p>
      <Link href="/onboarding">
        <Button className="animate-bounce" size="lg">
          Start for Free <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </Link>
    </div>
  );
};

export default StartForFree;
