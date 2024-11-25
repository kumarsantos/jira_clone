/** @format */

"use client";
import React, { Suspense, useEffect } from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import MDEditor from "@uiw/react-md-editor";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { issueSchema } from "@/lib/validators";
import useFetch from "@/hooks/useFetch";
import {
  createIssue,
  getIssuesForSprint,
  updateIssue,
} from "@/app/actions/issues";
import { getOrganizationUsers } from "@/app/actions/organization";
import { BarLoader } from "react-spinners";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const CreateIssue = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const orgId = searchParams.get("orgId");
  const sprintId = searchParams.get("sprintId");
  const projectId = searchParams.get("projectId");
  const issueId = searchParams.get("issueId");
  const isProject = searchParams.get("isProject");
  let status = searchParams.get("status");
  status = status ? status : "TODO";

  console.log({sprintId})

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(issueSchema),
    defaultValues: {
      title: "",
      priority: "",
      description: "",
      assigneeId: "",
    },
  });

  const getIssueDetails = async () => {
    try {
      const response = await getIssuesForSprint(sprintId);
      const result = response?.find((item) => item.id === issueId);
      reset({
        title: result.title,
        priority: result.priority ?? "MEDIUM",
        description: result.description,
        assigneeId: result.assigneeId,
      });
    } catch (error) {
      console.log(error);
    }
  };
  const updateIssueDetails = async (data) => {
    try {
      const res = await updateIssue(issueId, {
        ...data,
        status,
        sprintId,
      });
      res && toast.success("Issue update successfully");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    issueId && getIssueDetails();
  }, [issueId]);

  const {
    loading: createIssueLoading,
    fn: createIssueFn,
    error,
    data: createdIssue,
  } = useFetch(createIssue);

  const {
    loading: usersLoading,
    fn: fetchUserFn,
    data: users,
  } = useFetch(getOrganizationUsers);

  useEffect(() => {
    if (orgId) {
      fetchUserFn(orgId);
    }
  }, [orgId]);

  const onSubmit = async (data) => {
    if (issueId) {
      await updateIssueDetails(data);
    } else {
      await createIssueFn(projectId, {
        ...data,
        status,
        sprintId,
      });
    }
    if (isProject) {
      router.push(`/project/${projectId}`);
    } else {
      router.push(`/organization/${orgId}`);
    }
  };

  return (
      <div className="container">
        {(usersLoading || createIssueLoading) && (
          <BarLoader width={"100%"} color="#36d7b7" />
        )}
        <form className="p-4 space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label htmlFor="title" className="block text-sm font-medium mb-1">
              Title
            </label>
            <Input
              id="title"
              {...register("title")}
              placeholder="Enter title"
            />
            {errors?.title && (
              <p className="text-red-500 text-sm mt-1">
                {error?.title?.message}
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="assigneeId"
              className="block text-sm font-medium mb-1"
            >
              Assignee
            </label>
            <Controller
              name="assigneeId"
              control={control}
              render={({ field }) => {
                return (
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select Assignee" />
                    </SelectTrigger>
                    <SelectContent>
                      {users?.map((user) => (
                        <SelectItem key={user.id} value={user.id}>
                          {user?.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                );
              }}
            />
            {errors?.assigneeId && (
              <p className="text-red-500 text-sm mt-1">
                {error?.assigneeId?.message}
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium mb-1"
            >
              Description
            </label>
            <Controller
              name="description"
              control={control}
              render={({ field }) => {
                return (
                  <MDEditor value={field.value} onChange={field.onChange} />
                );
              }}
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">
                {error?.description?.message}
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="priority"
              className="block text-sm font-medium mb-1"
            >
              Priority
            </label>
            <Controller
              name="priority"
              control={control}
              render={({ field }) => {
                return (
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="LOW">LOW</SelectItem>
                      <SelectItem value="MEDIUM">MEDIUM</SelectItem>
                      <SelectItem value="HIGH">HIGH</SelectItem>
                      <SelectItem value="URGENT">URGENT</SelectItem>
                    </SelectContent>
                  </Select>
                );
              }}
            />
            {errors.priority && (
              <p className="text-red-500 text-sm mt-1">
                {error?.priority?.message}
              </p>
            )}
          </div>
          {error && (
            <p className="text-red-500 text-sm mt-1">{error.message}</p>
          )}
          <Button
            type="submit"
            className="w-full"
            disabled={createIssueLoading}
          >
            {createIssueLoading
              ? issueId
                ? "Updating..."
                : "Creating..."
              : issueId
                ? "Update Issue"
                : "Create Issue"}
          </Button>
        </form>
      </div>
  );
};

export default CreateIssue;
