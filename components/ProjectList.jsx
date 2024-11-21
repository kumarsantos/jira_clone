/** @format */

import { getProjects } from "@/app/actions/projects";
import Link from "next/link";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import DeleteProject from "./DeleteProject";

const ProjectList = async (orgId) => {
  const projects = await getProjects(orgId);
  if (!projects?.length) {
    return (
      <p>
        No Projects Found.{" "}
        <Link
          href="/project/create"
          className="underline underline-offset-2 text-blue-200"
        >
          Create New
        </Link>
      </p>
    );
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
      {projects?.map((project) => (
        <Card key={project.id}>
          <CardHeader>
            <CardTitle className="flex justify-between items-center">{project?.name}
                <DeleteProject projectId={project.id} />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500 mb-4">{project?.description}</p>
            <Link
              className="text-blue-500 hover:underline"
              href={`/project/${project.id}`}
            >
              View Project
            </Link>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ProjectList;
