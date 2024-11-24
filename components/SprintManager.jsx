/** @format */

import { format, formatDistanceToNow, isAfter, isBefore } from "date-fns";
import React, { useEffect, useRef, useState } from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import useFetch from "@/hooks/useFetch";
import { updateSprintStatus } from "@/app/actions/sprints";
import { BarLoader } from "react-spinners";
import { useRouter } from "next/navigation";

const SprintManager = ({
  sprint,
  setSprint,
  sprints,
  projectId,
  activeSprint,
}) => {
  const [status, setStatus] = useState(sprint?.status);
  const router = useRouter();
  const startDate = new Date(sprint?.startDate);
  const endDate = new Date(sprint?.endDate);
  const now = new Date();

  const canStart =
    isBefore(now, endDate) && isAfter(now, startDate) && status === "PLANNED";
  const canEnd = status === "ACTIVE";

  const {
    fn: updateStatus,
    loading,
    error,
    data: updatedStatus,
  } = useFetch(updateSprintStatus);

  useEffect(() => {
    if (updatedStatus && updatedStatus.success) {
      setStatus(updatedStatus?.sprint?.status);
      setSprint({
        ...sprint,
        status: updatedStatus?.sprint?.status,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updatedStatus]);

  const handleStatusChange = async (newStatus) => {
    await updateStatus(sprint?.id, newStatus);
    router.refresh();
  };

  const handleSprintChanges = (value) => {
    const selectedSprint = sprints?.find((s) => s.id === value);
    setSprint(selectedSprint);
    setStatus(selectedSprint?.status);
  };

  const getStatusText = () => {
    if (status === "COMPLETED") {
      return `Sprint Ended`;
    }
    if (status === "ACTIVE" && isAfter(now, endDate)) {
      return `Overdue by ${formatDistanceToNow(endDate)}`;
    }
    if (status === "PLANNED" && isBefore(now, startDate)) {
      return `Starts in ${formatDistanceToNow(startDate)}`;
    }
    return null;
  };
  return (
    <>
      <div className="flex justify-between items-center gap-4">
        <Select value={sprint?.id} onValueChange={handleSprintChanges}>
          <SelectTrigger className="bg-slate-950 self-start">
            <SelectValue placeholder="Select Sprint" />
          </SelectTrigger>
          <SelectContent>
            {sprints?.map((spr) => {
              return (
                <SelectItem key={spr?.id} value={spr?.id}>
                  {sprint?.name} ({format(sprint?.startDate, "MMM d, yyyy")}) to
                  ({format(sprint?.endDate, "MMM d, yyyy")})
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
        {canStart && (
          <Button
            className="bg-green-900 text-white hover:bg-green-700"
            onClick={() => handleStatusChange("ACTIVE")}
            disabled={loading || activeSprint?.length}
          >
            Start Sprint
          </Button>
        )}
        {canEnd && (
          <Button
            variant="destructive"
            onClick={() => handleStatusChange("COMPLETED")}
            disabled={loading}
          >
            End Sprint
          </Button>
        )}
      </div>
      {loading && <BarLoader width={"100%"} className="mt-2" color="#36d7b7" />}
      {getStatusText() && (
        <Badge className="mt-3 ml-1 self-start">{getStatusText()}</Badge>
      )}
    </>
  );
};

export default SprintManager;
