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
  return {addProject, deleteProject, getAllProjects, getProject, getProjectCount, getProjectIndex};
})();

export {AllProjects};