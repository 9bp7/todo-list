import {Project} from "./project.js";
import {AllProjects} from "./allProjects.js";

const ViewHandler = (() => {
  let allButtons = document.querySelectorAll("button");

  const trackNewProjectButtons = () => {
    allButtons.forEach(button => {
      if(button.dataset.btn === "new-project") {
        button.addEventListener('click', () => {
          let projectTitle = "";
          do {
            projectTitle = prompt("Name of project: ");
          } while(projectTitle === "");
          let newProject = Project(projectTitle);
          AllProjects.addProject(newProject);
        });
      }
    })
  };

  const updateSideBar = () => {
    
  }

  return {trackNewProjectButtons};
})();

export {ViewHandler};