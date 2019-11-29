import React from "react";
import { DragDropContext } from "react-beautiful-dnd";
import "./App.css";
import TaskList from "./TaskList";
import useTaskStorage from "./useTaskStorage";

function App() {
  // const { taskLists, moveTask } = useTaskStorage();

  const {
    taskLists,
    addTask,
    toggleTaskCompleted,
    deleteTask,
    editTaskName,
    moveTask,
    uncheckAllTasks
  } = useTaskStorage();
  const onDragEnd = result => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return;
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
        {Object.entries(taskLists).map(([taskId, task]) => (
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
          />
        ))}
      </DragDropContext>
    </div>
  );
}

export default App;
