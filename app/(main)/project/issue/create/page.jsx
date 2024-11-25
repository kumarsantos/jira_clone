/** @format */

import CreateIssue from "@/components/CreateIssue";
import React, { Suspense } from "react";

const CreateIssueComponent = () => {
  return (
    <Suspense fallback={<p>Loading..</p>}>
      <CreateIssue />
    </Suspense>
  );
};

export default CreateIssueComponent;
