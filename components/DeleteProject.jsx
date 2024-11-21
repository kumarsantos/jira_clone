/** @format */

"use client";
import React, { useState } from "react";
import { useOrganization } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { Button } from "./ui/button";
import { Trash2 } from "lucide-react";
import { deleteProject } from "@/app/actions/projects";

const DeleteProject = ({ projectId }) => {
  const path = usePathname();
  const [loading, setLoading] = useState(false);
  const { membership } = useOrganization();
  const isAdmin = membership?.role === "org:admin";
  if (!isAdmin) return null;

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      setLoading(true);
      await deleteProject(projectId, path);
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        size="sm"
        variant="ghost"
        onClick={handleDelete}
        className={`${loading ? "animate-pulse" : ""}`}
      >
        <Trash2 className="h-4 w-4 text-gray-100" />
      </Button>
    </>
  );
};

export default DeleteProject;
