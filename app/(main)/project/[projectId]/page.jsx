/** @format */
"use client";
import { getProject } from "@/app/actions/projects";
import SprintBoard from "@/components/SprintBoard";
import SprintCreationForm from "@/components/SprintCreationForm";
import { useParams } from "next/navigation";
import React, { Suspense, useCallback, useEffect, useState } from "react";
import { BarLoader } from "react-spinners";

const Project = () => {
  const params = useParams();
  const { projectId } = params;
  const [projectDetails, setProjectDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const getProjectDetails = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getProject(projectId);
      setProjectDetails(response);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    getProjectDetails();
  }, [getProjectDetails, projectId]);

  console.log({ projectDetails });

  return (
    <Suspense fallback={<p>Loading...</p>}>
      <div className="container mx-auto">
        {loading && <BarLoader width="100%" />}
        {/* Spring creation */}
        {!!Boolean(projectDetails) && (
          <SprintCreationForm
            projectTitle={projectDetails?.name}
            projectId={projectId}
            projectKey={projectDetails?.key}
            sprintKey={projectDetails?.sprints?.length + 1}
            getProjectDetails={getProjectDetails}
          />
        )}
        {/* Spring board */}
        {/* {projectDetails?.sprints?.length > 0 ? (
          <SprintBoard
            sprints={projectDetails?.sprints}
            projectId={projectId}
            orgId={projectDetails?.organizationId}
            getProjectDetails={getProjectDetails}
          />
        ) : (
          <p>Please create sprint by clicking on the above button</p>
        )} */}
      </div>
    </Suspense>
  );
};

export default Project;
