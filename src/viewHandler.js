import {ToDoItem} from "./task.js";
import {Project} from "./project.js";
import {AllProjects} from "./allProjects.js";

const ViewHandler = (() => {
  let allButtons = document.querySelectorAll("button");
  let sideBarFavourites = document.querySelector(".sidebar-favourites");
  let sideBarProjects = document.querySelector(".sidebar-projects");
  let display = document.querySelector(".display-inner");
  let currentDisplayedProject = 0;

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
          updateSideBar();
        });
      }
    })
  };

  const trackNewTaskButtons = () => {
    allButtons = document.querySelectorAll("button");
    allButtons.forEach(button => {
      if(button.dataset.btn === "new-task") {
        button.addEventListener('click', () => {
          let projectID = +button.dataset.projectid;

          let newTask = "";
          do {
            newTask = prompt("What do you want to do?");
          } while(newTask === "");

          let newTaskItem = ToDoItem(newTask, "", null, null, null, null);
          let selectedProject = AllProjects.getProject(projectID);
          selectedProject.addTask(newTaskItem);
          displayProject(currentDisplayedProject);
        });
      }
    })
  };

  const trackSideBarTabs = () => {
    let sideBarLinks = document.querySelectorAll(".project-link");
    sideBarLinks.forEach(link => {
      console.log(link);
      link.addEventListener('click', () => {
        let linkProjectID = link.dataset.id;
        displayProject(linkProjectID);
      })
    });
  }

  const clearSideBar = () => {
    sideBarFavourites.innerHTML = "";
    sideBarProjects.innerHTML = "";
  }

  const updateSideBar = () => {
    clearSideBar();

    let i = 0;
    AllProjects.getAllProjects().forEach(project => {
      if(project.isFavourite()) {
        sideBarFavourites.innerHTML += `<li class="project-link" data-id="${i}"> ${project.getTitle()}</li>`;
      } else {
        sideBarProjects.innerHTML += `<li class="project-link" data-id="${i}"> ${project.getTitle()}</li>`;
      }
      i++;
    });

    trackSideBarTabs();
  }

  const displayProject = (projectID) => {
    currentDisplayedProject = projectID;

    let project = AllProjects.getProject(projectID);

    display.innerHTML = `<h3>${project.getTitle()} <button class="add-btn" data-btn="new-task" data-projectID="${projectID}">＋ Add Task</button></h3>`;
    display.innerHTML += `<ul>`;
    project.getTasks().forEach(task => {
      display.innerHTML += `<li><input type="checkbox"> ${task.getTitle()}</li>`;
    });
    display.innerHTML += `</ul>`;

    trackNewTaskButtons();
  }

  return {trackNewProjectButtons, updateSideBar, displayProject};
})();

export {ViewHandler};