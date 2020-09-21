import {ToDoItem} from "./task.js";
import {Project} from "./project.js";
import {AllProjects} from "./allProjects.js";
import {Modal, AllModals, ConfirmCancelModal, FormModal, PopupModal} from "./modals.js";

const ViewHandler = (() => {
  let allButtons = document.querySelectorAll("button");
  let sideBar = document.querySelector('aside');
  let sideBarFavourites = document.querySelector(".sidebar-favourites");
  let sideBarProjects = document.querySelector(".sidebar-projects");
  let display = document.querySelector(".display-inner");
  let taskCheckboxEventListeners = [];
  let addingProject = false;
  let currentView = {type: "",
                     projects: []};
  let updateDisplay;
  let newTaskModal;
  let newTaskModalHTML =
  `<input type="text" id="modifytask-name" name="modifytask-name" placeholder="Task name" tabindex="0">
    <input type="text" id="modifytask-desc" name="modifytask-desc" placeholder="Description"> 
    <label for="modifytask-duedate">Due date (optional):</label>   
    <input type="date" id="modifytask-duedate" name="modifytask-duedate">
    <label for="modifytask-duedate">Priority:</label>   
    <select id="modifytask-priority" name="modifytask-priority">
      <option value="low">Low</option>
      <option value="med">Medium</option>
      <option value="high">High</option>
    </select>
    <textarea id="modifytask-notes" name="modifytask-notes" rows="3" placeholder="Add additional notes here"></textarea>`;
  let newTaskProjectID = 0;
  let editTaskModal;
  let editTaskProjectID = 0;
  let editTaskProjectIndex = 0;

  const setCurrentView = (type, projects) => {
    currentView.type = type;
    currentView.projects = projects;
  }

  const handleNewTaskSubmit = (formData) => {
    let errors = false;
    let formObjects = {};
    for (let pair of formData.entries()) {
      if(pair[0] === 'modifytask-name') {
        if(pair[1].length === 0) {
          newTaskModal.addErrorLabel('You need to enter a task name!', pair[0]);
          errors = true;
        } else {
          newTaskModal.removeErrorLabel(pair[0]);
        }      
      }
      formObjects[pair[0]] = pair[1];
    }

    if(!errors) {
      let currentProject = AllProjects.getProject(newTaskProjectID);
      let newToDo = ToDoItem(formObjects['modifytask-name'], formObjects['modifytask-desc'], formObjects['modifytask-duedate'], formObjects['modifytask-priority'], formObjects['modifytask-notes'], null);
      currentProject.addTask(newToDo);
      updateDisplay();
      newTaskModal.hide();
    }
  }

  newTaskModal = FormModal('New Task', handleNewTaskSubmit, null, 'Add Task', 'Cancel');

  const handleNewTaskClick = () => {
    let newTaskBtns = display.querySelectorAll('button[data-btn="new-task"]');
    newTaskBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        newTaskProjectID = btn.dataset.projectid;
        newTaskModal.addFormHTML(newTaskModalHTML);
        newTaskModal.show();
      });
    });
  }

  const handleEditTaskSubmit = (formData) => {
    let errors = false;
    let formObjects = {};
    for (let pair of formData.entries()) {
      if(pair[0] === 'modifytask-name') {
        if(pair[1].length === 0) {
          editTaskModal.addErrorLabel('You need to enter a task name!', pair[0]);
          errors = true;
        } else {
          editTaskModal.removeErrorLabel(pair[0]);
        }      
      }
      formObjects[pair[0]] = pair[1];
    }

    if(!errors) {
      let containingProject = AllProjects.getProject(editTaskProjectID);
      let taskToEdit = containingProject.getTask(editTaskProjectIndex);

      taskToEdit.setTitle(formObjects['modifytask-name']);
      taskToEdit.setDescription(formObjects['modifytask-desc']);
      taskToEdit.setDueDate(formObjects['modifytask-duedate']);
      taskToEdit.setPriority(formObjects['modifytask-priority']);
      taskToEdit.setNotes(formObjects['modifytask-notes']);
      updateDisplay();
      editTaskModal.hide();
    }
  }

  editTaskModal = FormModal('Edit Task', handleEditTaskSubmit, null, 'Edit Task', 'Cancel');

  const handleEditTaskClick = () => {
    let allTaskListItems = document.querySelectorAll('li');
    allTaskListItems.forEach(listItem => {
      if(listItem.querySelector('span[data-btn="edit-task"]')) {
        listItem.querySelector('span[data-btn="edit-task"]').addEventListener('click', () => {
          editTaskProjectID = +listItem.dataset.projectid;
          editTaskProjectIndex = +listItem.dataset.projectindex;
          let containingProject = AllProjects.getProject(editTaskProjectID);
          let taskToEdit = containingProject.getTask(editTaskProjectIndex);
          let priority = taskToEdit.getPriority();

          let editTaskModalHTML =
            `<input type="text" id="modifytask-name" name="modifytask-name" placeholder="Task name" value="${taskToEdit.getTitle()}" tabindex="0">
              <input type="text" id="modifytask-desc" name="modifytask-desc" value="${taskToEdit.getDescription()}" placeholder="Description"> 
              <label for="modifytask-duedate">Due date (optional):</label>   
              <input type="date" id="modifytask-duedate" value="${taskToEdit.getDueDate()}" name="modifytask-duedate">
              <label for="modifytask-duedate">Priority:</label>   
              <select id="modifytask-priority" name="modifytask-priority">
                <option value="low" ${priority === 'low' ? 'selected' : ''}>Low</option>
                <option value="med" ${priority === 'med' ? 'selected' : ''}>Medium</option>
                <option value="high" ${priority === 'high' ? 'selected' : ''}>High</option>
              </select>
              <textarea id="modifytask-notes" name="modifytask-notes" rows="3" placeholder="Add additional notes here">${taskToEdit.getNotes()}</textarea>`;
            
          editTaskModal.addFormHTML(editTaskModalHTML);
          editTaskModal.show();

          //let myPopup = PopupModal('Edit Task', `Editing ${taskToEdit.getTitle()}`, `Okay`, null);
          //myPopup.show();
        });
      }      
    });
  }

  const confirmDeleteTask = (containingProject, taskToDelete) => {
    containingProject.deleteTask(taskToDelete);
    updateDisplay();
  }

  const handleDeleteTaskClick = () => {
    let allTaskListItems = document.querySelectorAll('li');
    allTaskListItems.forEach(listItem => {
      if(listItem.querySelector('span[data-btn="del-task"]')) {
        listItem.querySelector('span[data-btn="del-task"]').addEventListener('click', () => {
          let containingProject = AllProjects.getProject(+listItem.dataset.projectid);
          let taskToDelete = containingProject.getTask(+listItem.dataset.projectindex);
          let confirmDeletionModal = ConfirmCancelModal(`Delete Task`, `Do you really wish to permanently delete task '${taskToDelete.getTitle()}'?`, () => confirmDeleteTask(containingProject, taskToDelete), null, "Delete Task", "Cancel", true);
          confirmDeletionModal.show();
        });
      }      
    });
  }

  const clearDisplay = () => {
    display.innerHTML = "";
  }
  
  const displayProject = (projectID) => {
    let projectToDisplay = AllProjects.getProject(projectID);

    if(projectToDisplay.isFavourite()) {
      display.innerHTML += 
      `<h3>${projectToDisplay.getTitle()}<button class="add-btn small-btn" data-btn="new-task" data-projectid=${projectID}>＋ Add Task</button></h3>`;
    } else {
      display.innerHTML += 
      `<h3>${projectToDisplay.getTitle()}<button class="add-btn small-btn" data-btn="new-task" data-projectid=${projectID}>＋ Add Task</button><button class="add-btn delete-project-btn small-btn" data-btn="del-project" data-projectid=${projectID}>Delete Project</button></h3>`;
    }

    let projectList = document.createElement('ul');
    let tasksToDisplay = projectToDisplay.getTasks();

    tasksToDisplay.sort(function(x, y) {
      return (x.getComplete() === y.getComplete())? 0 : x.getComplete()? 1 : -1;
    });

    for(let i = 0; i < tasksToDisplay.length; i++) {
      let individualTask = document.createElement('li');
      individualTask.dataset.projectindex = i;
      individualTask.dataset.projectid = projectID;
      if(tasksToDisplay[i].getComplete()) {
        individualTask.classList.add('todo-complete');
      }

      individualTask.innerHTML += 
        `<input class="todo-tick" type="checkbox" ${tasksToDisplay[i].getComplete() ? 'checked' : ''}><span class="todo-pri-${tasksToDisplay[i].getPriority()}">${tasksToDisplay[i].getTitle()}</span>`

      if(!tasksToDisplay[i].getComplete()) {
        if(tasksToDisplay[i].getDescription() !== "") {
          individualTask.innerHTML += 
            `<p class="todo-desc">${tasksToDisplay[i].getDescription()}</p>`;
        }
  
        if(tasksToDisplay[i].getDueDate() !== "" && tasksToDisplay[i].getDueDate() !== null) {
          individualTask.innerHTML += 
            `<p class="todo-desc">Due on ${tasksToDisplay[i].getDueDate()}</p>`;
        }
      } 

      individualTask.innerHTML += `<p class="todo-editdel"><span class="todo-edit" data-btn="edit-task">Edit</span> <span class="todo-del" data-btn="del-task">Delete</span></p>`;

      projectList.appendChild(individualTask);
    }

    display.appendChild(projectList);

    updateSideBar();
  };

  const displayOneProject = (projectID) => {
    clearDisplay();
    setCurrentView('one', [AllProjects.getProject(projectID)]);
    displayProject(projectID);
    handleTaskCheckboxes();
    handleDeleteProjectButtons();
    handleNewTaskClick();
    handleEditTaskClick();
    handleDeleteTaskClick();
  }

  const displayAllProjects = () => {
    clearDisplay();
    setCurrentView('all', AllProjects.getAllProjects());

    for(let i = 0; i < AllProjects.getProjectCount(); i++) {
      displayProject(i);
    }

    handleTaskCheckboxes();
    handleDeleteProjectButtons();
    handleNewTaskClick();
    handleEditTaskClick();
    handleDeleteTaskClick();
  };

  updateDisplay = () => {
    console.log('updating display');
    if(currentView.type === 'all') {
      displayAllProjects();
    } else if (currentView.type === 'one') {
      displayOneProject(AllProjects.getProjectIndex(currentView.projects[0]));
    }
  }

  const handleTaskCheckboxes = () => {
    let allTaskListItems = display.querySelectorAll('li');

    allTaskListItems.forEach(listItem => {
      listItem.childNodes.forEach(childNode => {
        if(childNode.tagName === 'INPUT' && childNode.type === 'checkbox') {
          if(taskCheckboxEventListeners.indexOf(childNode) === -1 ){
            taskCheckboxEventListeners.push(childNode);
            childNode.addEventListener('CheckboxStateChange', () => {
              console.log('toggling completion task id ' + listItem.dataset.projectindex);

              let project = AllProjects.getProject(listItem.dataset.projectid);
              let taskToToggleCompletion = project.getTask(listItem.dataset.projectindex);
              taskToToggleCompletion.setComplete(childNode.checked);
              updateDisplay();
            });
          } else {
            console.log(`event exists for ${listItem.textContent}`);
          }
        }
      });
    });
  }

  const clearSideBar = () => {
    sideBarFavourites.innerHTML = "";
    sideBarProjects.innerHTML = "";
  }

  const showSideBarLinks = () => {
    let allProjects = AllProjects.getAllProjects();
    let newProjectButtons = document.querySelectorAll('button[data-btn="new-project"]');
    
    let i = 0;
    allProjects.forEach(project => {
      if(project.isFavourite()) {
        sideBarFavourites.innerHTML += 
          `<li class="project-link" data-id=${i}>${project.getTitle()}</li>`
      } else {
        sideBarProjects.innerHTML += 
          `<li class="project-link" data-id=${i}>${project.getTitle()}</li>`
      }
      i++;
    });

    sideBarFavourites.innerHTML += 
      `<li class="project-link" data-id="all-tasks">All Tasks</li>`;


    if(addingProject) {
      newProjectButtons.forEach(button => button.innerHTML = "<span class='btn-symbol'>✕</span> Cancel")
      sideBarProjects.innerHTML += 
        `<div class="add-project"><form class="add-project-form"><input type="text" class="add-project-field" placeholder="Name your project"><input type="submit" class="add-project-submit" value="＋"></form></div>`;
    } else {
      newProjectButtons.forEach(button => button.innerHTML = "<span class='btn-symbol'>＋</span> New Project")
    }
  }

  const showSelectedSideBarLink = () => {
    if(currentView.type === 'all') {
      let sideBarAllTasks = sideBarFavourites.querySelector('li[data-id="all-tasks"]');
      sideBarAllTasks.classList.add('selected');
    } else if (currentView.type === 'one') {
      let currentProjectIndex = AllProjects.getProjectIndex(currentView.projects[0]);
      let sideBarCurrentTask = sideBar.querySelector(`li[data-id="${currentProjectIndex}"]`);
      sideBarCurrentTask.classList.add('selected');
    }
  }

  const handleSideBarClicks = () => {
    let sideBarLinks = sideBar.querySelectorAll('li');
    sideBarLinks.forEach(link => {
      link.addEventListener('click', () => {
        if(link.dataset.id === 'all-tasks') {
          ViewHandler.displayAllProjects();
        } else {
          ViewHandler.displayOneProject(+link.dataset.id);
        }
        addingProject = false;
        updateSideBar();
      });
    });
  }

  const handleNewProjectClick = (() => {
    let newProjectButtons = document.querySelectorAll('button[data-btn="new-project"]');
    newProjectButtons.forEach(link => {
      link.addEventListener('click', () => {
        addingProject = !addingProject;
        updateSideBar(false);  
        if(addingProject) {
          document.querySelector('.add-project-field').focus();
          handleNewProjectSubmit();
        }              
      });
    });    
  })();

  const handleNewProjectSubmit = () => {
    let newProjectForm = document.querySelector('.add-project-form');
    let newProjectField = document.querySelector('.add-project-field');

    newProjectForm.addEventListener('submit', e => {
      e.preventDefault();
      if(newProjectField.value !== '') {
        let newProject = Project(newProjectField.value);
        AllProjects.addProject(newProject);
        addingProject = false;
        ViewHandler.displayOneProject(AllProjects.getProjectIndex(newProject));
        updateSideBar();        
      }
    });
  }

  const updateSideBar = (doHandleNewProjectClick = true) => {
    clearSideBar();
    showSideBarLinks();
    showSelectedSideBarLink();
    handleSideBarClicks();
  }

  const confirmDeleteProject = (project) => {
    AllProjects.deleteProject(project);
    displayAllProjects();    
    updateSideBar();
    
  }

  const handleDeleteProjectButtons = () => {
    let deleteProjectBtns = display.querySelectorAll(`button[data-btn="del-project"]`);
    deleteProjectBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        let project = AllProjects.getProject(+btn.dataset.projectid);
        let myModal = ConfirmCancelModal(`Delete ${project.getTitle()}`, `Do you really wish to permanently delete your project '${project.getTitle()}'?`, () => confirmDeleteProject(project), null, "Delete Project", "Cancel", true);
        myModal.show();
      });
    });
  }

  return {displayOneProject, displayAllProjects};

  


  /*

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
    });
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
  */
})();

export {ViewHandler};