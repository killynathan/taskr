import * as React from "react";
import { Droppable, Draggable } from "react-beautiful-dnd";
import useTaskStorage from "./useTaskStorage";

const TaskList = props => {
  const [newTaskName, setNewTaskName] = React.useState("");
  const {
    taskLists,
    addTask,
    toggleTaskCompleted,
    deleteTask,
    editTaskName,
    uncheckAllTasks
  } = props;
  const activeTaskList = taskLists[props.taskId];
  console.log("?", taskLists);
  return (
    <div style={styles.container}>
      <p>{props.title}</p>
      <button onClick={() => uncheckAllTasks(props.taskId)}>Uncheck All</button>
      <Droppable droppableId={props.taskId}>
        {provided => (
          <div ref={provided.innerRef} {...provided.droppableProps}>
            {activeTaskList.tasks.map((task, i) => (
              <Draggable draggableId={task.id} index={i} key={task.id}>
                {provided => (
                  <div
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    ref={provided.innerRef}
                    style={{
                      display: "flex",
                      marginBottom: 10,
                      backgroundColor: "white",
                      padding: 10,
                      ...provided.draggableProps.style
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => {
                        toggleTaskCompleted({
                          taskListId: props.taskId,
                          taskIndex: i
                        });
                        console.log(provided);
                      }}
                    />
                    <input
                      value={task.name}
                      onChange={e =>
                        editTaskName({
                          taskListId: props.taskId,
                          taskIndex: i,
                          newTaskName: e.target.value
                        })
                      }
                    />
                    <button
                      onClick={() =>
                        deleteTask({ taskListId: props.taskId, taskIndex: i })
                      }
                    >
                      x
                    </button>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
      <input
        type="text"
        value={newTaskName}
        onChange={e => setNewTaskName(e.target.value)}
        onKeyDown={e => {
          if (e.keyCode === 13) {
            addTask({ taskId: props.taskId, taskName: newTaskName });
            setNewTaskName("");
          }
        }}
      />
    </div>
  );
};

const styles = {
  container: {
    width: 200,
    backgroundColor: "lightgrey",
    marginRight: 10,
    padding: 5
  }
};

export default TaskList;
