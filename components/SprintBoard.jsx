/** @format */
"use client";

import React, { startTransition, useEffect, useState } from "react";
import SprintManager from "./SprintManager";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import { boardHeading } from "@/constants";
import { Button } from "./ui/button";
import { Plus } from "lucide-react";
import CreateIssueDrawer from "./CreateIssue";
import useFetch from "@/hooks/useFetch";
import { getIssuesForSprint, updateIssueOrder } from "@/app/actions/issues";
import { BarLoader } from "react-spinners";
import IssueCard from "./IssueCard";
import { toast } from "sonner";

const reOrderList = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

const SprintBoard = ({ sprints, projectId, orgId }) => {
  const [currentSprint, setCurrentSprint] = useState(
    sprints?.find((spr) => spr?.status === "ACTIVE") || sprints?.[0]
  );
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(null);

  const {
    loading: issuesLoading,
    error: issuesError,
    fn: fetchIssues,
    data: issues,
    setData: setIssues,
  } = useFetch(getIssuesForSprint);

  const {
    fn: updateIssueOrderFn,
    loading: updateIssuesLoading,
    error: updateIssuesError,
  } = useFetch(updateIssueOrder);

  const handleIssueCreated = async () => {
    // startTransition(()=>{
    //   fetchIssues(currentSprint.id);
    // })
  };

  const [filteredIssues, setFilteredIssues] = useState(issues);

  useEffect(() => {
    if (currentSprint.id) {
      fetchIssues(currentSprint.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSprint.id]);

  const onDragEnd = async (result) => {
    if (currentSprint?.status === "PLANNED") {
      toast.warning("Start the sprint to update the board");
      return;
    }
    if (currentSprint?.status === "COMPLETED") {
      toast.warning("Can not update the board after sprint end");
      return;
    }

    const { destination, source } = result;
    if (
      destination?.droppableId === source?.droppableId &&
      destination?.index &&
      source?.index
    ) {
      return;
    }

    const newOrderedData = [...issues];
    const sourceList = newOrderedData?.filter(
      (list) => list.status === source.droppableId
    );
    const destinationList = newOrderedData?.filter(
      (list) => list.status === destination.droppableId
    );

    if (source.droppableId === destination.droppableId) {
      const reorderCards = reOrderList(
        sourceList,
        source.index,
        destination.index
      );
      reorderCards.forEach((item, idx) => {
        item.order = idx;
      });
    } else {
      const [movedCard] = sourceList.splice(source.index, 1);
      movedCard.status = destination.droppableId;
      destinationList.splice(destination.index, 0, movedCard);

      sourceList.forEach((item, idx) => {
        item.order = idx;
      });
      destinationList.forEach((item, idx) => {
        item.order = idx;
      });
    }
    const sortedIssues = newOrderedData.sort((a, b) => a.order - b.order);
    setIssues(newOrderedData, sortedIssues);

    // api call to update the order of the issue
    updateIssueOrderFn(sortedIssues);
  };

  const handleAddIssue = (status) => {
    setSelectedStatus(status);
    setIsDrawerOpen(true);
  };

  if (issuesError) {
    return <div>Error loading issues</div>;
  }
  return (
    <div>
      {/* Sprint Manager */}
      <SprintManager
        sprint={currentSprint}
        setSprint={setCurrentSprint}
        sprints={sprints}
        projectId={projectId}
      />

      {/* {issues && !issuesLoading && (
        <BoardFilters issues={issues} onFilterChange={handleFilterChange} />
      )} */}

      {updateIssuesError && (
        <p className="text-red-500 mt-2">{updateIssuesError?.message}</p>
      )}
      {(updateIssuesLoading || issuesLoading) && (
        <BarLoader className="mt-4" width={"100%"} color="#36d7b7" />
      )}
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mt-4 gap-4 bg-slate-950 p-4 rounded-lg">
          {boardHeading.map((col) => (
            <Droppable key={col.key} droppableId={col.key}>
              {(provided) => {
                return (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="space-y-2"
                  >
                    <h3 className="font-semibold mb-2 text-center">
                      {col.name}
                    </h3>
                    {/* Issues */}
                    {issues
                      ?.filter((issue) => issue.status === col.key)
                      .map((ISSUE, idx) => {
                        return (
                          <Draggable
                            key={ISSUE.id}
                            draggableId={ISSUE.id}
                            index={idx}
                          >
                            {(provided) => {
                              return (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                >
                                  <IssueCard issue={ISSUE} />
                                </div>
                              );
                            }}
                          </Draggable>
                        );
                      })}

                    {provided.placeholder}
                    {col.key === "TODO" &&
                      currentSprint.status !== "COMPLETED" && (
                        <Button
                          variant="ghost"
                          className="w-full"
                          onClick={() => handleAddIssue(col.key)}
                        >
                          <Plus className="mr-2 h-4 w-4" /> Create Issue
                        </Button>
                      )}
                  </div>
                );
              }}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
      <CreateIssueDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        sprintId={currentSprint.id}
        status={selectedStatus}
        projectId={projectId}
        onIssueCreated={handleIssueCreated}
        orgId={orgId}
      />
    </div>
  );
};

export default SprintBoard;
