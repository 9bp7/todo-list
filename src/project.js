const Project = (title, favourite = false) => {
  let tasks = [];
  const addTask = (task) => tasks.push(task);
  const getTask = (position) => tasks[position];
  const getTasks = () => tasks;
  const getTitle = () => title;
  const deleteTask = (task) => {
    const taskIndex = tasks.indexOf(task);
    if (taskIndex > -1) {
      tasks.splice(taskIndex, 1);
    }
  }
  const isFavourite = () => favourite;
  return {addTask, getTask, getTasks, getTitle, deleteTask, isFavourite};
}

export {Project};