/** @format */

"use client";
import React, { useState } from "react";
import { Button } from "./ui/button";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePathname, useRouter } from "next/navigation";
import useFetch from "@/hooks/useFetch";
import { sprintSchema } from "@/lib/validators";
import { createSprint } from "@/app/actions/sprints";
import { Input } from "./ui/input";
import { addDays, format } from "date-fns";
import { Card, CardContent } from "./ui/card";
import { Popover, PopoverTrigger } from "./ui/popover";
import { CalendarRangeIcon } from "lucide-react";
import { PopoverContent } from "@radix-ui/react-popover";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";
import { toast } from "sonner";

const SprintCreationForm = ({
  projectTitle,
  projectId,
  projectKey,
  sprintKey,
  getProjectDetails,
}) => {
  const [isShowForm, setIsShowForm] = useState(false);
  const [dateRange, setDateRange] = useState({
    from: new Date(),
    to: addDays(new Date(), 14),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm({
    resolver: zodResolver(sprintSchema),
    defaultValues: {
      name: `${projectKey}-${sprintKey}`,
      startDate: dateRange?.from ?? new Date(),
      endDate: dateRange?.to ?? new Date(),
    },
  });

  const { loading: createSprintLoading, fn: createSprintFn } =
    useFetch(createSprint);

  const onSubmit = async (data) => {
    await createSprintFn(projectId, {
      ...data,
      startDate: dateRange?.from ?? new Date(),
      endDate: dateRange?.to ?? addDays(new Date(), 14),
    });
    setIsShowForm(false);
    toast.success("Sprint created successfully");
    await getProjectDetails();
  };

  return (
    <>
      <div className="flex justify-between">
        <h1 className="text-5xl font-bold mb-8 gradient-title">
          {projectTitle}
        </h1>
        <Button
          className="mb-2"
          onClick={() => setIsShowForm(!isShowForm)}
          variant={isShowForm ? "destructive" : "default"}
        >
          {isShowForm ? "Cancel" : "Create New Spring"}
        </Button>
      </div>
      {isShowForm && (
        <Card className="pt-4 mb-4">
          <CardContent>
            <form
              className="flex gap-4 items-end"
              onSubmit={handleSubmit(onSubmit)}
            >
              <div className="flex-1">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium mb-1"
                >
                  Sprint Name
                </label>
                <Input
                  id="name"
                  readOnly
                  className="bg-slate-950"
                  {...register("name")}
                />
                {errors?.name && <p>{errors?.name?.message}</p>}
              </div>
              <div className="flex-1">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium mb-1"
                >
                  Sprint Duration
                </label>
                <Controller
                  control={control}
                  name="dateRange"
                  render={(field) => {
                    return (
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={`w-full justify-start text-left font-normal bg-slate-950 ${!dateRange && "text-muted-foreground"}`}
                          >
                            <CalendarRangeIcon className="mr-2 h-4 w-4" />
                            {dateRange?.from && dateRange?.to ? (
                              format(dateRange.from ?? new Date(), "LL dd, y") +
                              " - " +
                              format(
                                dateRange.to || addDays(new Date(), 14),
                                "LL dd, y"
                              )
                            ) : (
                              <span>Pick a date</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent
                          className="w-auto bg-slate-900"
                          align="start"
                        >
                          <DayPicker
                            classNames={{
                              chevron: "fill-blue-500",
                              range_start: "bg-blue-700",
                              range_end: "bg-blue-700",
                              range_middle: "bg-blue-400",
                              day_button: "border-none",
                              today: "border-2 border-blue-700",
                            }}
                            mode="range"
                            disabled={[{ before: new Date() }]}
                            selected={dateRange}
                            onSelect={(range) => {
                              if (range?.from && range?.to) {
                                setDateRange(range);
                                field?.field?.onChange(range);
                              }
                            }}
                          />
                        </PopoverContent>
                      </Popover>
                    );
                  }}
                />
              </div>
              <Button type="submit" disabled={createSprintLoading}>
                {createSprintLoading ? "Creating..." : "Create Sprint"}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default SprintCreationForm;
