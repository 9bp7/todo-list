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
      } else if(allValues["newtask-medPriority"]) {
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

  const doEditTaskSubmit = (task) => {
    let allValues = EditTaskModal.getAllValues();
    let errors = false;

    if(allValues["newtask-name"] === '') {
      EditTaskModal.addErrorLabel("newtask-name", "You need to enter a name!");  
      errors = true;    
    }

    if(!errors) {
      let priority = "";
      if(allValues["newtask-lowPriority"]) {
        priority = "low";
      } else if(allValues["newtask-medPriority"]) {
        priority = "med";
      } else {
        priority = "high";
      }

      task.setTitle(allValues["newtask-name"]);
      task.setDescription(allValues["newtask-desc"]);
      task.setDueDate(allValues["newtask-dueDate"]);
      task.setPriority(priority);
      task.setNotes(allValues["newtask-notes"]);
      task.setChecklist(allValues["newtask-checklist"]);

      displayProject(currentDisplayedProject);
      EditTaskModal.hide();
    }
  }

  const trackEditTask = () => {
    let allTasks = display.querySelectorAll('li');

    allTasks.forEach(task => {
      
    });

    /*let allTasks = display.querySelectorAll('li');

    allTasks.forEach(task => {
      task.addEventListener('click', () => {
        let parentProject = AllProjects.getProject(+task.dataset.projectid);
        let thisTask = parentProject.getTask(+task.dataset.pos);
        let hasDueDate = thisTask.getDueDate();
        let priority = `newtask-${thisTask.getPriority()}Priority`;
        let toPopulateWith = {"newtask-name": thisTask.getTitle(),
                              "newtask-desc": thisTask.getDescription(),
                              "newtask-dueDate": thisTask.getDueDate(),
                              "newtask-dueDateCheck": hasDueDate,
                              [priority]: true,
                              "newtask-notes": thisTask.getNotes(),
                              "newtask-checklist": thisTask.getChecklist()};
        EditTaskModal.resetForm();
        EditTaskModal.show();
        EditTaskModal.trackCheckBox("duedate");
        EditTaskModal.trackCheckBox("checklist");
        EditTaskModal.populateForm(toPopulateWith);
        EditTaskModal.trackSubmit(() => {doEditTaskSubmit(thisTask)});
      });
    });*/
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
    let i = 0;
    project.getTasks().forEach(task => {
      let newTask = document.createElement('li');
      newTask.dataset.pos = i;
      newTask.dataset.projectid = projectID;

      let priority = task.getPriority();
      newTask.innerHTML += `<input type="checkbox"> <span class="todo-pri-${priority}">${task.getTitle()}</span>`;
      
      if(task.getDescription() !== "") {
        newTask.innerHTML += `<p class="todo-desc">${task.getDescription()}</p>`;
      }
      if(task.getDueDate() !== "" && task.getDueDate() !== null) {
        newTask.innerHTML += `<p class="todo-desc">Due ${task.getDueDate()}</p>`;
      }

      display.appendChild(newTask);
      i++;
    });
    display.innerHTML += `</ul>`;

    updateSideBar();
    trackNewTaskButtons();
    trackEditTask();
  }

  return {trackNewProjectButtons, updateSideBar, displayProject};
})();

export {ViewHandler};