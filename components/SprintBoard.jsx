/** @format */
"use client";

import React, { useEffect, useState } from "react";
import SprintManager from "./SprintManager";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import { boardHeading } from "@/constants";

import useFetch from "@/hooks/useFetch";
import { getIssuesForSprint, updateIssueOrder } from "@/app/actions/issues";
import { BarLoader } from "react-spinners";
import IssueCard from "./IssueCard";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import BoardFilters from "./BoardFilters";

const reOrderList = (list = [], startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

const SprintBoard = ({ sprints, projectId, orgId, getProjectDetails }) => {
  const activeSprint = sprints?.filter((spr) => spr?.status === "ACTIVE");
  const [currentSprint, setCurrentSprint] = useState(activeSprint?.[0] || sprints?.[0]);
  const router = useRouter();
  const [issues, setIssues] = useState([]);
  const [filteredIssues, setFilteredIssues] = useState(issues);


  console.log({currentSprint})

  const {
    fn: updateIssueOrderFn,
    loading: updateIssuesLoading,
    error: updateIssuesError,
  } = useFetch(updateIssueOrder);

  const getIssues = async () => {
    try {
      const response = await getIssuesForSprint(currentSprint.id);
      setIssues(response);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getIssues();
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
      (list) => list.status === source?.droppableId
    );
    const destinationList = newOrderedData?.filter(
      (list) => list.status === destination?.droppableId
    );

    if (source?.droppableId === destination?.droppableId) {
      const reorderCards = reOrderList(
        sourceList,
        source.index,
        destination.index
      );
      reorderCards.forEach((item, idx) => {
        item.order = idx;
      });
    } else {
      const [movedCard] = sourceList?.splice(source.index, 1);
      movedCard.status = destination?.droppableId;
      destinationList.splice(destination?.index, 0, movedCard);

      sourceList?.forEach((item, idx) => {
        item.order = idx;
      });
      destinationList?.forEach((item, idx) => {
        item.order = idx;
      });
    }

    const sortedIssues = newOrderedData.sort((a, b) => a.order - b.order);
    setIssues(newOrderedData, sortedIssues);
    // api call to update the order of the issue
    updateIssueOrderFn(sortedIssues);
  };

  const handleAddIssue = () => {
    router.push(
      `/project/issue/create?projectId=${projectId}&orgId=${orgId}&sprintId=${currentSprint?.id}&isProject=true`
    );
  };

  const handleFilter = (newFilteredIssues) => {
    setFilteredIssues(newFilteredIssues);
  };

  const handleSprint = async (value) => {
    setCurrentSprint(value);
    await getProjectDetails(value.id);
  };

  return (
    <div>
      {/* Sprint Manager */}
      <SprintManager
        sprint={currentSprint}
        setSprint={handleSprint}
        sprints={sprints}
        projectId={projectId}
        activeSprint={activeSprint}
      />

      <BoardFilters
        issues={issues}
        onFilterChange={handleFilter}
        handleAddIssue={handleAddIssue}
        currentSprint={currentSprint}
      />

      {updateIssuesError && (
        <p className="text-red-500 mt-2">{updateIssuesError?.message}</p>
      )}
      {updateIssuesLoading && (
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
                    {filteredIssues
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
                                  <IssueCard
                                    issue={ISSUE}
                                    getIssues={getIssues}
                                    projectId={projectId}
                                    orgId={orgId}
                                    sprintId={currentSprint?.id}
                                  />
                                </div>
                              );
                            }}
                          </Draggable>
                        );
                      })}

                    {provided.placeholder}
                  </div>
                );
              }}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
};

export default SprintBoard;
