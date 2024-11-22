/** @format */

import { getProject } from "@/app/actions/projects";
import SprintBoard from "@/components/SprintBoard";
import SprintCreationForm from "@/components/SprintCreationForm";
import { notFound } from "next/navigation";
import React from "react";

const Project = async ({ params }) => {
  const projectId = (await params)?.projectId;
  const projectDetails = await getProject(projectId);

  if (!projectDetails) {
    notFound();
  }



  return (
    <div className="container mx-auto">
      {/* Spring creation */}
      <SprintCreationForm
        projectTitle={projectDetails?.name}
        projectId={projectId}
        projectKey={projectDetails?.key}
        sprintKey={projectDetails?.sprints?.length + 1}
      />
      {/* Spring board */}
      {projectDetails?.sprints?.length > 0 ? (
        <SprintBoard
          sprints={projectDetails?.sprints}
          projectId={projectId}
          orgId={projectDetails?.organizationId}
        />
      ) : (
        <div>Create a Sprint from button above</div>
      )}
    </div>
  );
};

export default Project;
