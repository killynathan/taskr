import React from "react";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import "./App.css";
import TaskList from "./TaskList";
import useTaskStorage from "./useTaskStorage";
import NewListForm from "./NewListForm";

function App() {
  // const { taskLists, moveTask } = useTaskStorage();

  const {
    taskLists,
    taskListsOrder,
    addTask,
    toggleTaskCompleted,
    deleteTask,
    editTaskName,
    moveTask,
    uncheckAllTasks,
    addList,
    deleteList,
    moveTaskList
  } = useTaskStorage();
  const onDragEnd = result => {
    const { destination, source, draggableId, type } = result;
    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return;

    if (type === "column") {
      moveTaskList(draggableId, source.index, destination.index);
      return;
    }

    moveTask(
      source.droppableId,
      destination.droppableId,
      source.index,
      destination.index
    );
  };
  return (
    <div className="App">
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable
          droppableId="all-columns"
          direction="horizontal"
          type="column"
        >
          {provided => (
            <div
              className="App"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {taskListsOrder.map((taskId, i) => {
                const task = taskLists[taskId];
                return (
                  <TaskList
                    title={task.name}
                    key={taskId}
                    taskId={taskId}
                    addTask={addTask}
                    toggleTaskCompleted={toggleTaskCompleted}
                    deleteTask={deleteTask}
                    editTaskName={editTaskName}
                    taskLists={taskLists}
                    uncheckAllTasks={uncheckAllTasks}
                    deleteList={deleteList}
                    index={i}
                  />
                );
              })}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
      <NewListForm addList={addList} />
    </div>
  );
}

export default App;
