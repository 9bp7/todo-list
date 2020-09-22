const Project = (title, favourite = false) => {
  let tasks = [];
  const addTask = (task, toStart = true) => {
    if(toStart) {
      tasks.unshift(task);
    } else {
      tasks.push(task);
    }    
  }
  const getTask = (position) => tasks[position];
  const getTasks = () => tasks;
  const getTitle = () => title;
  const deleteTask = (task) => {
    const taskIndex = tasks.indexOf(task);
    if (taskIndex > -1) {
      tasks.splice(taskIndex, 1);
    }
  }
  const setTitle = (newTitle) => title = newTitle;
  const isFavourite = () => favourite;
  const getJSON = () => {
    let data = {};
    data.title = title;
    data.favourite = favourite;
    data.tasks = [];
    tasks.forEach(task => {
      data.tasks.push(JSON.parse(task.getJSON()));
    })
    return JSON.stringify(data);
  }
  return {getJSON, addTask, getTask, getTasks, getTitle, deleteTask, isFavourite, setTitle};
}

export {Project};