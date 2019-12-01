import usePersistedState from "./usePersistedState";

const initialState = {
  1: {
    name: "Backlog",
    tasks: []
  },
  2: {
    name: "Today",
    tasks: []
  }
};

const getId = () => String(Math.floor(Math.random() * 100000));

const createTask = ({ taskName }) => ({
  name: taskName,
  completed: false,
  id: String(getId())
});

const createList = ({ listName }) => ({
  name: listName,
  tasks: []
});

const editTask = (taskLists, taskListId, taskIndex, cb) => {
  return editTaskList(taskLists, taskListId, activeTaskList => {
    const newTasks = activeTaskList.tasks.map((task, i) =>
      i === taskIndex ? cb(task) : task
    );
    return {
      ...activeTaskList,
      tasks: newTasks
    };
  });
};

const editTaskList = (taskLists, taskListId, cb) => {
  const activeTaskList = taskLists[taskListId];
  return {
    ...taskLists,
    [taskListId]: cb(activeTaskList)
  };
};

export default function useTaskStorage() {
  const [taskLists, setTasks] = usePersistedState("tasks", initialState);
  const [taskListsOrder, setTasksListOrder] = usePersistedState(
    "taskListsOrder",
    []
  );

  const addTask = ({ taskId, taskName }) => {
    const activeTaskList = taskLists[taskId];
    const newTasks = [...activeTaskList.tasks, createTask({ taskName })];
    const newTaskLists = {
      ...taskLists,
      [taskId]: {
        ...activeTaskList,
        tasks: newTasks
      }
    };
    setTasks(newTaskLists);
  };

  const toggleTaskCompleted = ({ taskListId, taskIndex }) => {
    const newTaskLists = editTask(taskLists, taskListId, taskIndex, task => ({
      ...task,
      completed: !task.completed
    }));
    setTasks(newTaskLists);
  };

  const deleteTask = ({ taskListId, taskIndex }) => {
    const newTaskLists = editTaskList(taskLists, taskListId, taskList => ({
      ...taskList,
      tasks: taskList.tasks.filter((task, i) => i !== taskIndex)
    }));
    setTasks(newTaskLists);
  };

  const editTaskName = ({ taskListId, taskIndex, newTaskName }) => {
    const newTaskLists = editTask(taskLists, taskListId, taskIndex, task => ({
      ...task,
      name: newTaskName
    }));
    setTasks(newTaskLists);
  };

  const moveTask = (
    sourceTaskListId,
    destinationTaskListId,
    sourceIndex,
    destinationIndex
  ) => {
    const destinationTaskList = taskLists[destinationTaskListId];
    const sourceTaskList = taskLists[sourceTaskListId];
    const destinationTasks = Array.from(destinationTaskList.tasks);
    const sourceTasks = Array.from(sourceTaskList.tasks);
    const task = sourceTasks[sourceIndex];
    sourceTasks.splice(sourceIndex, 1);
    if (sourceTaskListId === destinationTaskListId) {
      sourceTasks.splice(destinationIndex, 0, task);
      const newTaskLists = {
        ...taskLists,
        [sourceTaskListId]: {
          ...sourceTaskList,
          tasks: sourceTasks
        }
      };
      console.log(newTaskLists, taskLists, sourceTasks);
      setTasks(newTaskLists);
    } else {
      console.log(sourceTaskListId, destinationTaskListId);
      destinationTasks.splice(destinationIndex, 0, task);
      const newTaskLists = {
        ...taskLists,
        [sourceTaskListId]: {
          ...sourceTaskList,
          tasks: sourceTasks
        },
        [destinationTaskListId]: {
          ...destinationTaskList,
          tasks: destinationTasks
        }
      };
      setTasks(newTaskLists);
    }
  };

  const uncheckAllTasks = taskListId => {
    const newState = editTaskList(taskLists, taskListId, taskList => {
      return {
        ...taskList,
        tasks: taskList.tasks.map(task => ({ ...task, completed: false }))
      };
    });
    setTasks(newState);
  };

  const addList = newListName => {
    const id = getId();
    const newState = {
      ...taskLists,
      [id]: createList({ listName: newListName })
    };

    setTasksListOrder([...taskListsOrder, id]);
    setTasks(newState);
  };

  const deleteList = taskListId => {
    const { [taskListId]: removedTaskList, ...newState } = taskLists;
    const newTaskListsOrder = taskListsOrder.filter(x => x !== taskListId);
    setTasksListOrder(newTaskListsOrder);
    setTasks(newState);
  };

  const moveTaskList = (taskListId, sourceIndex, destinationIndex) => {
    const newTaskListsOrder = Array.from(taskListsOrder);
    newTaskListsOrder.splice(sourceIndex, 1);
    newTaskListsOrder.splice(destinationIndex, 0, taskListId);
    setTasksListOrder(newTaskListsOrder);
  };

  return {
    addTask,
    taskLists,
    taskListsOrder,
    toggleTaskCompleted,
    deleteTask,
    editTaskName,
    moveTask,
    uncheckAllTasks,
    addList,
    deleteList,
    moveTaskList
  };
}
