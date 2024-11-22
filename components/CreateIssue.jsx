/** @format */

"use client";
import React, { useEffect, useState } from "react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

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
import { createIssue,} from "@/app/actions/issues";
import { getOrganizationUsers } from "@/app/actions/organization";
import { BarLoader } from "react-spinners";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

const CreateIssue = ({
  isOpen,
  onClose,
  sprintId,
  status,
  projectId,
  onIssueCreated,
  orgId,
}) => {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(issueSchema),
    defaultValues: {
      priority: "MEDIUM",
      description: "",
      assigneeId: "",
    },
  });

  const {
    loading: createIssueLoading,
    fn: createIssueFn,
    error,
    data: createdIssue,
  } = useFetch(createIssue);

  useEffect(() => {
    if (createdIssue) {
      reset();
      onClose();
      onIssueCreated();
    }
  }, [createdIssue, onClose, onIssueCreated, reset]);

  const {
    loading: usersLoading,
    fn: fetchUserFn,
    data: users,
  } = useFetch(getOrganizationUsers);

  useEffect(() => {
    if (isOpen && orgId) {
      fetchUserFn(orgId);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, orgId]);

  const onSubmit = async (data) => {
    await createIssueFn(projectId, {
      ...data,
      status,
      sprintId,
    });
  };


  return (
    <Drawer open={isOpen} onClose={onClose}>
      <DrawerContent className="min-h-screen">
        <DrawerHeader>
          <DrawerTitle>Create New Issue</DrawerTitle>
        </DrawerHeader>
        {usersLoading && <BarLoader width={"100%"} color="#36d7b7" />}
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
            {createIssueLoading ? "Creating..." : "Create Issue"}
          </Button>
        </form>
      </DrawerContent>
    </Drawer>
  );
};

export default CreateIssue;
