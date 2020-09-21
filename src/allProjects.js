const AllProjects = (() => {
  let projects = [];
  const addProject = (project) => projects.push(project);
  const deleteProject = (project) => {
    const projectIndex = projects.indexOf(project);
    if (projectIndex > -1) {
      projects.splice(projectIndex, 1);
    }
  }
  const getAllProjects = () => projects;
  const getProject = (projectID) => {
    return projects[projectID];
  };
  const getProjectCount = () => projects.length;
  const getProjectIndex = (project) => projects.indexOf(project);
  const saveExists = () => {
    if(localStorage.getItem('projects')) {
      return true;
    }
    return false;    
  }
  const save = () => {
    let projectsToSave = [];
    projects.forEach(project => projectsToSave.push(JSON.parse(project.getJSON())));

    // Done, this can be saved officially now
    console.log(JSON.stringify(projectsToSave));


  }
  const load = () => {
    // For each project in the parsed JSON string
    // Create a Project
    // Then call function in project.js that converts the JSON string to project details
    // This will also need to call a function in task.js that converts JSON to task details

  }
  return {addProject, deleteProject, getAllProjects, getProject, getProjectCount, getProjectIndex, saveExists, save, load};
})();

export {AllProjects};