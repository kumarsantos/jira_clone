/** @format */

import { Suspense } from "react";
import { BarLoader } from "react-spinners";

const ProjectLayout = async ({ children }) => {
  return (
    <div className="container mx-auto mt-5">
      <Suspense fallback={<BarLoader width={"100%"} color="#367bb7" />}>
        {children}
      </Suspense>
    </div>
  );
};
export default ProjectLayout;
