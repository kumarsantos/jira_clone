/** @format */
"use client";
import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "./ui/badge";
import UserAvatar from "./UserAvatar";
import { formatDistanceToNow } from "date-fns";
import { Button } from "./ui/button";
import { LucideDelete } from "lucide-react";
import { toast } from "sonner";
import { deleteIssue } from "@/app/actions/issues";
import { useUser } from "@clerk/nextjs";
import { usePathname, useRouter } from "next/navigation";

const priorityColor = {
  LOW: "border-green-600",
  MEDIUM: "border-yellow-300",
  HIGH: "border-orange-400",
  URGENT: "border-red-400",
};

const IssueCard = ({
  issue,
  projectId,
  orgId,
  sprintId,
  getIssues = async () => {},
  showStatus = false,
}) => {
  const { user } = useUser();
  const router = useRouter();
  const path = usePathname();

  const created = formatDistanceToNow(new Date(issue?.createdAt), {
    addSuffix: true,
  });

  const handleDelete = async (e) => {
    e.stopPropagation();
    try {
      await deleteIssue(issue.id);
      await getIssues();
    } catch (error) {
      toast.error("Failed to delete the issue");
    }
  };
  const handleRedirect = () => {
    if (path?.includes("project")) {
      router.push(
        `/project/issue/create/?issueId=${issue?.id}&orgId=${orgId}&projectId=${projectId}&sprintId=${sprintId}&status=${issue.status}&isProject=true`
      );
    } else {
      router.push(
        `/project/issue/create/?issueId=${issue?.id}&orgId=${orgId}&projectId=${projectId}&sprintId=${sprintId}&status=${issue.status}`
      );
    }
  };

  return (
    <>
      <Card
        className="cursor-pointer hover:shadow-md transition-shadow"
        onClick={handleRedirect}
      >
        <CardHeader
          className={`border-t-2 ${priorityColor[issue?.priority]} rounded-lg`}
        >
          <CardTitle>{issue?.title}</CardTitle>
        </CardHeader>
        <CardContent className="flex gap-2 -mt-3">
          {showStatus && <Badge>{issue?.status}</Badge>}
          <Badge variant="outline" className="-ml-1">
            {issue?.priority}
          </Badge>
        </CardContent>
        <CardFooter className="flex flex-col items-start space-y-3">
          <UserAvatar user={issue?.assignee} />
          <div className="text-xs text-gray-400 w-full flex justify-between">
            <span>Created {created}</span>
            {issue?.reporter?.clerkUserId === user?.id && (
              <span>
                <Button
                  onClick={handleDelete}
                  variant="ghost"
                  className="text-white h-8 w-8 bg-orange-800"
                  size="xs"
                >
                  <LucideDelete />
                </Button>
              </span>
            )}
          </div>
        </CardFooter>
      </Card>
    </>
  );
};

export default IssueCard;
