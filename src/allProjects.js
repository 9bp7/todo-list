import { Project } from "./project.js";
import { ToDoItem } from "./task.js";

const AllProjects = (() => {
  let projects = [];
  const addProject = (project) => projects.push(project);
  const deleteProject = (project) => {
    const projectIndex = projects.indexOf(project);
    if (projectIndex > -1) {
      projects.splice(projectIndex, 1);
    }
  };
  const getAllProjects = () => projects;
  const getProject = (projectID) => {
    return projects[projectID];
  };
  const getProjectCount = () => projects.length;
  const getProjectIndex = (project) => projects.indexOf(project);
  const saveExists = () => {
    if (localStorage.getItem("projects")) {
      return true;
    }
    return false;
  };
  const save = () => {
    let projectsToSave = [];
    projects.forEach((project) =>
      projectsToSave.push(JSON.parse(project.getJSON()))
    );

    localStorage.setItem("projects", JSON.stringify(projectsToSave));
  };
  const load = () => {
    let loadedSave = JSON.parse(localStorage.getItem("projects"));
    loadedSave.forEach((project) => {
      let loadedProject = Project(project.title, project.favourite);
      addProject(loadedProject);
      project.tasks.forEach((task) => {
        let loadedToDoItem = ToDoItem(
          task.title,
          task.description,
          task.dueDate,
          task.priority,
          task.notes,
          task.checklist
        );
        loadedToDoItem.setComplete(task.completed);
        loadedToDoItem.setCompletionDate(task.completionDate);
        loadedToDoItem.setCreationDate(task.creationDate);
        loadedProject.addTask(loadedToDoItem, false);
      });
    });
  };
  return {
    addProject,
    deleteProject,
    getAllProjects,
    getProject,
    getProjectCount,
    getProjectIndex,
    saveExists,
    save,
    load,
  };
})();

export { AllProjects };
