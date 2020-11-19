import { ToDoItem } from "./task.js";
import { Project } from "./project.js";
import { AllProjects } from "./allProjects.js";
import { ConfirmCancelModal, FormModal } from "./modals.js";
import { format, isPast, addDays } from "date-fns";

const ViewHandler = (() => {
  let sideBar = document.querySelector("aside");
  let sideBarFavourites = document.querySelector(".sidebar-favourites");
  let sideBarProjects = document.querySelector(".sidebar-projects");
  let display = document.querySelector(".display-inner");
  let taskCheckboxEventListeners = [];
  let addingProject = false;
  let currentView = { type: "", projects: [] };
  let updateDisplay;
  let newTaskModal;
  let newTaskModalHTML = `<input type="text" id="modifytask-name" name="modifytask-name" placeholder="Task name" tabindex="0">
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
  let moveTaskModal;
  let moveTaskProjectID = 0;
  let moveTaskTaskID = 0;
  let renameProjectModal;
  let renameProjectProjectID = 0;
  let dragging = 0;

  const setCurrentView = (type, projects) => {
    currentView.type = type;
    currentView.projects = projects;
  };

  const handleRenameProjectSubmit = (formData) => {
    let errors = false;
    let formObjects = {};
    for (let pair of formData.entries()) {
      if (pair[0] === "rename-project-name") {
        if (pair[1].length === 0) {
          renameProjectModal.addErrorLabel(
            "You need to enter a new name!",
            pair[0]
          );
          errors = true;
        } else {
          renameProjectModal.removeErrorLabel(pair[0]);
        }
      }
      formObjects[pair[0]] = pair[1];
    }

    if (!errors) {
      let projectToRename = AllProjects.getProject(renameProjectProjectID);
      projectToRename.setTitle(formObjects["rename-project-name"]);
      updateDisplay();
      renameProjectModal.hide();
    }
  };

  renameProjectModal = FormModal(
    "Rename Project",
    handleRenameProjectSubmit,
    null,
    "Rename Project",
    "Cancel"
  );

  const handleRenameProjectButtons = () => {
    let renameProjectButtons = display.querySelectorAll(
      `button[data-btn="rename-project"]`
    );
    renameProjectButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        renameProjectProjectID = +btn.dataset.projectid;
        let project = AllProjects.getProject(renameProjectProjectID);

        let renameProjectModalHTML = `<label for="rename-project-name">What would you like to rename '${project.getTitle()}'?</label> 
          <input type="text" id="rename-project-name" name="rename-project-name" placeholder="New project title" value="" tabindex="0">`;

        renameProjectModal.addFormHTML(renameProjectModalHTML);
        renameProjectModal.show();
      });
    });
  };

  const handleNewTaskSubmit = (formData) => {
    let errors = false;
    let formObjects = {};
    for (let pair of formData.entries()) {
      if (pair[0] === "modifytask-name") {
        if (pair[1].length === 0) {
          newTaskModal.addErrorLabel("You need to enter a task name!", pair[0]);
          errors = true;
        } else {
          newTaskModal.removeErrorLabel(pair[0]);
        }
      }
      formObjects[pair[0]] = pair[1];
    }

    if (!errors) {
      let currentProject = AllProjects.getProject(newTaskProjectID);
      let newToDo = ToDoItem(
        formObjects["modifytask-name"],
        formObjects["modifytask-desc"],
        formObjects["modifytask-duedate"],
        formObjects["modifytask-priority"],
        formObjects["modifytask-notes"],
        null
      );
      currentProject.addTask(newToDo);
      updateDisplay();
      newTaskModal.hide();
    }
  };

  newTaskModal = FormModal(
    "New Task",
    handleNewTaskSubmit,
    null,
    "Add Task",
    "Cancel"
  );

  const handleNewTaskClick = () => {
    let newTaskBtns = display.querySelectorAll('button[data-btn="new-task"]');
    newTaskBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        newTaskProjectID = btn.dataset.projectid;
        newTaskModal.addFormHTML(newTaskModalHTML);
        newTaskModal.show();
      });
    });
  };

  const handleEditTaskSubmit = (formData) => {
    let errors = false;
    let formObjects = {};
    for (let pair of formData.entries()) {
      if (pair[0] === "modifytask-name") {
        if (pair[1].length === 0) {
          editTaskModal.addErrorLabel(
            "You need to enter a task name!",
            pair[0]
          );
          errors = true;
        } else {
          editTaskModal.removeErrorLabel(pair[0]);
        }
      }
      formObjects[pair[0]] = pair[1];
    }

    if (!errors) {
      let containingProject = AllProjects.getProject(editTaskProjectID);
      let taskToEdit = containingProject.getTask(editTaskProjectIndex);

      taskToEdit.setTitle(formObjects["modifytask-name"]);
      taskToEdit.setDescription(formObjects["modifytask-desc"]);
      taskToEdit.setDueDate(formObjects["modifytask-duedate"]);
      taskToEdit.setPriority(formObjects["modifytask-priority"]);
      taskToEdit.setNotes(formObjects["modifytask-notes"]);
      updateDisplay();
      editTaskModal.hide();
    }
  };

  editTaskModal = FormModal(
    "Edit Task",
    handleEditTaskSubmit,
    null,
    "Edit Task",
    "Cancel"
  );

  const handleEditTaskClick = () => {
    let allTaskListItems = document.querySelectorAll("li");
    allTaskListItems.forEach((listItem) => {
      if (listItem.querySelector('span[data-btn="edit-task"]')) {
        listItem
          .querySelector('span[data-btn="edit-task"]')
          .addEventListener("click", () => {
            editTaskProjectID = +listItem.dataset.projectid;
            editTaskProjectIndex = +listItem.dataset.projectindex;
            let containingProject = AllProjects.getProject(editTaskProjectID);
            let taskToEdit = containingProject.getTask(editTaskProjectIndex);
            let priority = taskToEdit.getPriority();

            let editTaskModalHTML = `<input type="text" id="modifytask-name" name="modifytask-name" placeholder="Task name" value="${taskToEdit.getTitle()}" tabindex="0">
              <input type="text" id="modifytask-desc" name="modifytask-desc" value="${taskToEdit.getDescription()}" placeholder="Description"> 
              <label for="modifytask-duedate">Due date (optional):</label>   
              <input type="date" id="modifytask-duedate" value="${taskToEdit.getDueDate()}" name="modifytask-duedate">
              <label for="modifytask-duedate">Priority:</label>   
              <select id="modifytask-priority" name="modifytask-priority">
                <option value="low" ${
                  priority === "low" ? "selected" : ""
                }>Low</option>
                <option value="med" ${
                  priority === "med" ? "selected" : ""
                }>Medium</option>
                <option value="high" ${
                  priority === "high" ? "selected" : ""
                }>High</option>
              </select>
              <textarea id="modifytask-notes" name="modifytask-notes" rows="3" placeholder="Add additional notes here">${taskToEdit.getNotes()}</textarea>`;

            editTaskModal.addFormHTML(editTaskModalHTML);
            editTaskModal.show();
          });
      }
    });
  };

  const confirmDeleteTask = (containingProject, taskToDelete) => {
    containingProject.deleteTask(taskToDelete);
    updateDisplay();
  };

  const handleDeleteTaskClick = () => {
    let allTaskListItems = document.querySelectorAll("li");
    allTaskListItems.forEach((listItem) => {
      if (listItem.querySelector('span[data-btn="del-task"]')) {
        listItem
          .querySelector('span[data-btn="del-task"]')
          .addEventListener("click", () => {
            let containingProject = AllProjects.getProject(
              +listItem.dataset.projectid
            );
            let taskToDelete = containingProject.getTask(
              +listItem.dataset.projectindex
            );
            let confirmDeletionModal = ConfirmCancelModal(
              `Delete Task`,
              `Do you really wish to permanently delete task '${taskToDelete.getTitle()}'?`,
              () => confirmDeleteTask(containingProject, taskToDelete),
              null,
              "Delete Task",
              "Cancel",
              true
            );
            confirmDeletionModal.show();
          });
      }
    });
  };

  const handleMoveTaskSubmit = (formData) => {
    let formObjects = {};
    for (let pair of formData.entries()) {
      formObjects[pair[0]] = pair[1];
    }

    let projectFrom = AllProjects.getProject(moveTaskProjectID);
    let projectTo = AllProjects.getProject(+formObjects["movetask-to"]);
    let task = projectFrom.getTask(moveTaskTaskID);
    projectTo.addTask(task);
    projectFrom.deleteTask(task);

    updateDisplay();
    moveTaskModal.hide();
  };

  moveTaskModal = FormModal(
    "Move Task",
    handleMoveTaskSubmit,
    null,
    "Move Task",
    "Cancel"
  );

  const handleMoveTaskClick = () => {
    let allTaskListItems = document.querySelectorAll("li");
    allTaskListItems.forEach((listItem) => {
      if (listItem.querySelector('span[data-btn="move-task"]')) {
        listItem
          .querySelector('span[data-btn="move-task"]')
          .addEventListener("click", () => {
            moveTaskProjectID = +listItem.dataset.projectid;
            moveTaskTaskID = +listItem.dataset.projectindex;
            let containingProject = AllProjects.getProject(moveTaskProjectID);
            let taskToEdit = containingProject.getTask(moveTaskTaskID);

            let moveTaskModalHTML = `<label for="movetask-to">Move '${taskToEdit.getTitle()}' to which project?</label>   
            <select id="movetask-to" name="movetask-to">`;

            AllProjects.getAllProjects().forEach((project) => {
              let projectIndex = AllProjects.getProjectIndex(project);
              if (projectIndex !== moveTaskProjectID) {
                moveTaskModalHTML += `<option value="${projectIndex}">${project.getTitle()}</option>`;
              }
            });

            moveTaskModalHTML += `</select>`;

            moveTaskModal.addFormHTML(moveTaskModalHTML);
            moveTaskModal.show();
          });
      }
    });
  };

  const clearDisplay = () => {
    display.innerHTML = "";
  };

  const displayProject = (projectID) => {
    let projectToDisplay = AllProjects.getProject(projectID);

    if (projectToDisplay.isFavourite()) {
      display.innerHTML += `<h3>${projectToDisplay.getTitle()}<button class="add-btn small-btn" data-btn="new-task" data-projectid=${projectID}>＋ Add Task</button></h3>`;
    } else {
      display.innerHTML += `<h3>${projectToDisplay.getTitle()}<button class="add-btn small-btn add-proj-btn" data-btn="new-task" data-projectid=${projectID}>＋ Add Task</button><button class="add-btn delete-project-btn small-btn" data-btn="rename-project" data-projectid=${projectID}><img class="project-trash" src="img/pencil.svg"></button><button class="add-btn delete-project-btn small-btn" data-btn="del-project" data-projectid=${projectID}><img class="project-trash" src="img/trash.svg"></button></h3>`;
    }

    let projectList = document.createElement("ul");
    let tasksToDisplay = projectToDisplay.getTasks();

    tasksToDisplay.sort(function (x, y) {
      return x.getComplete() === y.getComplete() ? 0 : x.getComplete() ? 1 : -1;
    });

    for (let i = 0; i < tasksToDisplay.length; i++) {
      let individualTask = document.createElement("li");
      individualTask.dataset.projectindex = i;
      individualTask.dataset.projectid = projectID;
      if (tasksToDisplay[i].getComplete()) {
        individualTask.classList.add("todo-complete");
      }

      individualTask.innerHTML += `<input class="todo-tick" type="checkbox" ${
        tasksToDisplay[i].getComplete() ? "checked" : ""
      }><span class="todo-pri-${tasksToDisplay[
        i
      ].getPriority()}">${tasksToDisplay[i].getTitle()}</span>`;

      if (!tasksToDisplay[i].getComplete()) {
        if (tasksToDisplay[i].getDescription() !== "") {
          individualTask.innerHTML += `<p class="todo-desc">${tasksToDisplay[
            i
          ].getDescription()}</p>`;
        }

        if (
          tasksToDisplay[i].getDueDate() !== "" &&
          tasksToDisplay[i].getDueDate() !== null
        ) {
          let parsedDate = Date.parse(tasksToDisplay[i].getDueDate());
          if (isPast(addDays(parsedDate, 1))) {
            individualTask.innerHTML += `<p class="todo-desc todo-overdue">${format(
              Date.parse(tasksToDisplay[i].getDueDate()),
              "do LLL"
            )}</p>`;
          } else {
            individualTask.innerHTML += `<p class="todo-desc">${format(
              Date.parse(tasksToDisplay[i].getDueDate()),
              "do LLL"
            )}</p>`;
          }
        }
      }

      individualTask.innerHTML += `<p class="todo-editdel"><span class="todo-edit" data-btn="edit-task"><img class="todo-trash" src="img/pencil.svg" alt="Edit"></span><span class="todo-move" data-btn="move-task"><img class="todo-trash" src="img/folder.svg" alt="Move"></span><span class="todo-del" data-btn="del-task"><img class="todo-trash" src="img/trash.svg" alt="Delete"></span></p>`;

      projectList.appendChild(individualTask);
    }

    display.appendChild(projectList);

    updateSideBar();
  };

  const displayOneProject = (projectID) => {
    clearDisplay();
    setCurrentView("one", [AllProjects.getProject(projectID)]);
    displayProject(projectID);
    handleTaskCheckboxes();
    handleDeleteProjectButtons();
    handleNewTaskClick();
    handleEditTaskClick();
    handleDeleteTaskClick();
    handleMoveTaskClick();
    handleRenameProjectButtons();
    AllProjects.save();
  };

  const displayAllProjects = () => {
    clearDisplay();
    setCurrentView("all", AllProjects.getAllProjects());

    for (let i = 0; i < AllProjects.getProjectCount(); i++) {
      displayProject(i);
    }

    handleTaskCheckboxes();
    handleDeleteProjectButtons();
    handleNewTaskClick();
    handleEditTaskClick();
    handleDeleteTaskClick();
    handleMoveTaskClick();
    handleRenameProjectButtons();
    AllProjects.save();
  };

  updateDisplay = () => {
    console.log("updating display");
    if (currentView.type === "all") {
      displayAllProjects();
    } else if (currentView.type === "one") {
      displayOneProject(AllProjects.getProjectIndex(currentView.projects[0]));
    }
  };

  const handleTaskCheckboxes = () => {
    let allTaskListItems = display.querySelectorAll("li");

    allTaskListItems.forEach((listItem) => {
      listItem.childNodes.forEach((childNode) => {
        if (childNode.tagName === "INPUT" && childNode.type === "checkbox") {
          if (taskCheckboxEventListeners.indexOf(childNode) === -1) {
            taskCheckboxEventListeners.push(childNode);
            childNode.addEventListener("CheckboxStateChange", () => {
              console.log(
                "toggling completion task id " + listItem.dataset.projectindex
              );

              let project = AllProjects.getProject(listItem.dataset.projectid);
              let taskToToggleCompletion = project.getTask(
                listItem.dataset.projectindex
              );
              taskToToggleCompletion.setComplete(childNode.checked);
              updateDisplay();
            });
          } else {
            console.log(`event exists for ${listItem.textContent}`);
          }
        }
      });
    });
  };

  const clearSideBar = () => {
    sideBarFavourites.innerHTML = "";
    sideBarProjects.innerHTML = "";
  };

  const rearrangeProjectDrag = (e) => {
    e.preventDefault();
    dragging = e.target.dataset.id;
    e.target.classList.add('dragging');
  }

  const rearrangeProjectDragStart = (e) => {
    e.target.style.cursor = "grabbing";
    
  }

  const rearrangeProjectDragEnd = (e) => {
    e.target.style.cursor = "default";
    e.target.classList.remove('dragging');
  }

  const rearrangeProjectDragOver = (e) => {
    e.preventDefault();    
    e.target.classList.add('dragging');
  }

  const rearrangeProjectDragLeave = (e) => {
    e.preventDefault();   
    e.target.classList.remove('dragging');
  }

  const rearrangeProjectDrop = (e) => {
    e.preventDefault();
    let projectToMove = AllProjects.getProject(dragging);
    AllProjects.setProjectPosition(projectToMove, e.target.dataset.id);
    showSideBarLinks();
    updateDisplay();
  }

  const showSideBarLinks = () => {
    let allProjects = AllProjects.getAllProjects();
    let newProjectButtons = document.querySelectorAll(
      'button[data-btn="new-project"]'
    );

    let i = 0;
    allProjects.forEach((project) => {
      let li = document.createElement('li');
      if (project.isFavourite()) {
        sideBarFavourites.innerHTML += `<li class="project-link" data-id=${i}>${project.getTitle()}</li>`;
      } else {
        li.draggable = true;        
        li.innerText = project.getTitle();
        li.dataset.id = i;
        li.classList.add('project-link');
        sideBarProjects.appendChild(li);
       
        //sideBarProjects.innerHTML += `<li class="project-link" data-id=${i}>${project.getTitle()}</li>`;
      }
      i++;
    });

    sideBarFavourites.innerHTML += `<li class="project-link" data-id="all-tasks">All Tasks</li>`;

    if (addingProject) {
      newProjectButtons.forEach(
        (button) =>
          (button.innerHTML = "<span class='btn-symbol'>✕</span> Cancel")
      );
      sideBarProjects.innerHTML += `<div class="add-project"><form class="add-project-form"><input type="text" class="add-project-field" placeholder="Name your project"><input type="submit" class="add-project-submit" value="＋"></form></div>`;
    } else {
      newProjectButtons.forEach(
        (button) =>
          (button.innerHTML = "<span class='btn-symbol'>＋</span> New Project")
      );
    }
  };

  const showSelectedSideBarLink = () => {
    if (currentView.type === "all") {
      let sideBarAllTasks = sideBarFavourites.querySelector(
        'li[data-id="all-tasks"]'
      );
      sideBarAllTasks.classList.add("selected");
    } else if (currentView.type === "one") {
      let currentProjectIndex = AllProjects.getProjectIndex(
        currentView.projects[0]
      );
      let sideBarCurrentTask = sideBar.querySelector(
        `li[data-id="${currentProjectIndex}"]`
      );
      sideBarCurrentTask.classList.add("selected");
    }
  };

  const handleSideBarClicks = () => {
    let sideBarLinks = sideBar.querySelectorAll("li");
    sideBarLinks.forEach((link) => {
      link.addEventListener("click", () => {
        if (link.dataset.id === "all-tasks") {
          ViewHandler.displayAllProjects();
        } else {
          ViewHandler.displayOneProject(+link.dataset.id);
        }
        addingProject = false;
        updateSideBar();
      });
      if (link.draggable) {
        link.addEventListener('drag', rearrangeProjectDrag);
        link.addEventListener('dragstart', rearrangeProjectDragStart);
        link.addEventListener('dragend', rearrangeProjectDragEnd);
        link.addEventListener('dragover', rearrangeProjectDragOver);
        link.addEventListener('dragleave', rearrangeProjectDragLeave);
        link.addEventListener('drop', rearrangeProjectDrop);
      }
    });
  };

  // eslint-disable-next-line
  const handleNewProjectClick = (() => {
    let newProjectButtons = document.querySelectorAll(
      'button[data-btn="new-project"]'
    );
    newProjectButtons.forEach((link) => {
      link.addEventListener("click", () => {
        addingProject = !addingProject;
        updateSideBar(false);
        if (addingProject) {
          document.querySelector(".add-project-field").focus();
          handleNewProjectSubmit();
        }
      });
    });
  })();

  const handleNewProjectSubmit = () => {
    let newProjectForm = document.querySelector(".add-project-form");
    let newProjectField = document.querySelector(".add-project-field");

    newProjectForm.addEventListener("submit", (e) => {
      e.preventDefault();
      if (newProjectField.value !== "") {
        let newProject = Project(newProjectField.value);
        AllProjects.addProject(newProject);
        addingProject = false;
        ViewHandler.displayOneProject(AllProjects.getProjectIndex(newProject));
        updateSideBar();
      }
    });
  };

  const updateSideBar = () => {
    clearSideBar();
    showSideBarLinks();
    showSelectedSideBarLink();
    handleSideBarClicks();
  };

  const confirmDeleteProject = (project) => {
    AllProjects.deleteProject(project);
    displayAllProjects();
    updateSideBar();
  };

  const handleDeleteProjectButtons = () => {
    let deleteProjectBtns = display.querySelectorAll(
      `button[data-btn="del-project"]`
    );
    deleteProjectBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        let project = AllProjects.getProject(+btn.dataset.projectid);
        let myModal = ConfirmCancelModal(
          `Delete ${project.getTitle()}`,
          `Do you really wish to permanently delete your project '${project.getTitle()}' and all of its tasks?`,
          () => confirmDeleteProject(project),
          null,
          "Delete Project",
          "Cancel",
          true
        );
        myModal.show();
      });
    });
  };

  return { displayOneProject, displayAllProjects };
})();

export { ViewHandler };
