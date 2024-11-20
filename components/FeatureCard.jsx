
import React from "react";
import { Card, CardContent } from "@/components/ui/card";

const FeatureCard = ({ feature }) => {
  return (
    <Card className="bg-gray-800">
      <CardContent className="pt-6">
        <feature.icon className="h-12 w-12  mb-4 text-blue-300" />
        <h4 className="text-xl font-semibold mb-2">{feature.title}</h4>
        <p className="text-gray-300">{feature.description}</p>
      </CardContent>
    </Card>
  );
};

export default FeatureCard;
