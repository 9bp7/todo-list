import {ToDoItem} from "./task.js";
import {Project} from "./project.js";
import {AllProjects} from "./allProjects.js";
import {Modal, AllModals, NewTaskModal, EditTaskModal, NewProjectModal} from "./modals.js";

const ViewHandler = (() => {
  let allButtons = document.querySelectorAll("button");
  let sideBarFavourites = document.querySelector(".sidebar-favourites");
  let sideBarProjects = document.querySelector(".sidebar-projects");
  let display = document.querySelector(".display-inner");
  let currentDisplayedProject = 0;
  let currentInteractedProject = 0;

  const addNewTask = () => {

  }

  const trackNewProjectButtons = () => {
    allButtons.forEach(button => {
      if(button.dataset.btn === "new-project") {
        button.addEventListener('click', () => {
          let projectTitle = "";
          do {
            projectTitle = prompt("Name of project: ");
          } while(projectTitle === "" || projectTitle === null);
          let newProject = Project(projectTitle);
          AllProjects.addProject(newProject);
          updateSideBar();
        });
      }
    })
  };

  const doNewTaskSubmit = () => {
    let allValues = NewTaskModal.getAllValues();
    let errors = false;

    if(allValues["newtask-name"] === '') {
      NewTaskModal.addErrorLabel("newtask-name", "You need to enter a name!");  
      errors = true;    
    }

    if(!errors) {
      let priority = "";
      if(allValues["newtask-lowPriority"]) {
        priority = "low";
      } else if(allValues["newtask-lowPriority"]) {
        priority = "med";
      } else {
        priority = "high";
      }

      let newTaskItem = ToDoItem(allValues["newtask-name"],
                                 allValues["newtask-desc"],
                                 allValues["newtask-dueDate"],
                                 priority,
                                 allValues["newtask-notes"],
                                 allValues["newtask-checklist"]);
      let selectedProject = AllProjects.getProject(currentInteractedProject);
      selectedProject.addTask(newTaskItem);
      displayProject(currentDisplayedProject);
      NewTaskModal.hide();
    }
  }

  const trackNewTaskButtons = () => {
    allButtons = document.querySelectorAll("button");
    allButtons.forEach(button => {
      if(button.dataset.btn === "new-task") {
        button.addEventListener('click', () => {
          currentInteractedProject = +button.dataset.projectid;

          NewTaskModal.resetForm();
          NewTaskModal.show([EditTaskModal, NewProjectModal]);
          NewTaskModal.trackCheckBox("duedate");
          NewTaskModal.trackCheckBox("checklist");
          NewTaskModal.trackSubmit(() => {doNewTaskSubmit()});
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
        if(i === currentDisplayedProject) {
          sideBarFavourites.innerHTML += `<li class="project-link selected" data-id="${i}"> ${project.getTitle()}</li>`;
        } else {
          sideBarFavourites.innerHTML += `<li class="project-link" data-id="${i}"> ${project.getTitle()}</li>`;
        }
      } else {
        if(i === currentDisplayedProject) {
          sideBarProjects.innerHTML += `<li class="project-link selected" data-id="${i}"> ${project.getTitle()}</li>`;  
        } else {
          sideBarProjects.innerHTML += `<li class="project-link" data-id="${i}"> ${project.getTitle()}</li>`;  
        }
      }
      i++;
    });

    trackSideBarTabs();
  }

  const displayProject = (projectID) => {
    currentDisplayedProject = +projectID;

    let project = AllProjects.getProject(projectID);

    display.innerHTML = `<h3>${project.getTitle()} <button class="add-btn" data-btn="new-task" data-projectID="${projectID}">＋ Add Task</button></h3>`;
    display.innerHTML += `<ul>`;
    project.getTasks().forEach(task => {
      let newTask = document.createElement('li');

      newTask.innerHTML += `<input type="checkbox"> ${task.getTitle()}`;
      if(task.getDescription() !== "") {
        newTask.innerHTML += `<p class="todo-desc">${task.getDescription()}</p>`;
      }
      if(task.getDueDate() !== "" && task.getDueDate() !== null) {
        newTask.innerHTML += `<p class="todo-desc">Due ${task.getDueDate()}</p>`;
      }

      display.appendChild(newTask);
    });
    display.innerHTML += `</ul>`;

    updateSideBar();
    trackNewTaskButtons();
  }

  return {trackNewProjectButtons, updateSideBar, displayProject};
})();

export {ViewHandler};