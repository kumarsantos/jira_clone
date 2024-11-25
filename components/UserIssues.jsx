/** @format */

import React, { Suspense } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import IssueCard from "./IssueCard";
import { getUserIssues } from "@/app/actions/organization";

const UserIssues = async ({ userId }) => {
  const issues = await getUserIssues(userId);

  if (issues?.length === 0) {
    return null;
  }

  const assignedIssues = issues?.filter(
    (issue) => issue.assignee.clerkUserId === userId
  );
  const reportedIssues = issues?.filter(
    (issue) => issue.reporter.clerkUserId === userId
  );

  return (
    <>
      <h1 className="text-4xl font-black gradient-title mb-4">My Issues</h1>
      <Tabs defaultValue="assigned" className="w-full">
        <TabsList>
          <TabsTrigger value="assigned">Assigned to You</TabsTrigger>
          <TabsTrigger value="reported">Reported by You</TabsTrigger>
        </TabsList>
        <TabsContent value="assigned">
          <Suspense fallback={<p>Loading...</p>}>
            <IssueGrid issues={assignedIssues} />
          </Suspense>
        </TabsContent>
        <TabsContent value="reported">
          <Suspense fallback={<p>Loading...</p>}>
            <IssueGrid issues={reportedIssues} />
          </Suspense>
        </TabsContent>
      </Tabs>
    </>
  );
};

function IssueGrid({ issues }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {issues?.map((issue) => {
        return (
          <IssueCard
            key={issue.id}
            issue={issue}
            showStatus
            projectId={issue?.projectId}
            sprintId={issue?.sprintId}
            orgId={issue?.project?.organizationId}
          />
        );
      })}
    </div>
  );
}

export default UserIssues;
