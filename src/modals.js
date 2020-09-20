/*const Modal = (modalTitle, modalID) => {
  let modalDiv = document.createElement('div');
  modalDiv.classList.add('modal');
  modalDiv.dataset.modalid = modalID;
  modalDiv.innerHTML += `<h3>${modalTitle}</h3>`;

  let body = document.querySelector('body');
  body.appendChild(modalDiv);

  const hideOtherModals = (modalsToHide = []) => {
    for(let i = 0; i < modalsToHide; i++) {
      modalsToHide[i].hide();
      console.log(modalsToHide[i]);
    }
  }

  const focusFirstElement = () => {
    let firstInputElement = modalDiv.querySelector('input');
    firstInputElement.focus();
  }

  const show = (modalsToHide = []) => {
    hideOtherModals(modalsToHide);
    modalDiv.classList.add('show');
    trackCloseButton();
  };

  const hide = () => {
    modalDiv.classList.remove('show');
  };

  const trackCloseButton = () => {
    let closeBtn = modalDiv.querySelector('#modal-close');
    closeBtn.addEventListener('click', () => {
      hide();
    });
  }

  const createCloseButton = (() => {
    modalDiv.innerHTML += `<h3 id="modal-close">✕</h3>`;
    trackCloseButton();
  })();

  return {show, hide, focusFirstElement};
};

const NewTaskModal = ((content) => {
  let modalID = 0;
  const prototype = Modal("New Task", modalID);
  let modal = document.querySelector(`div[data-modalid="${modalID}"]`);
  modal.innerHTML += `<form></form>`;

  let submitEventRegistered = false;

  const show = () => {
    prototype.show();
    prototype.focusFirstElement();
  }

  const resetForm = () => {
    let form = modal.querySelector('form');
    form.innerHTML =
      `<input type="text" id="newtask-name" name="newtask-name" placeholder="Task Name (e.g. eat cereals)" tabindex="0">
      <input type="text" id="newtask-desc"name="newtask-desc" placeholder="Description">
      <label for="newtask-addDueDateCheck" class="inlineblock">Add due date?</label>
      <input type="checkbox" data-check="duedate" id="newtask-dueDateCheck" name="newtask-addDueDateCheck">
      <input type="date" data-check="duedate" id="newtask-dueDate" class="hide" name="newtask-dueDate">
      
      <fieldset class="modal-priority">
        <p class="inlineblock">Priority:</p>
        <label for="newtask-lowPriority" class="inlineblock">Low</label>
        <input type="radio" id="newtask-lowPriority" name="newtask-priority" checked>
        <label for="newtask-medPriority" class="inlineblock">Medium</label>
        <input type="radio" id="newtask-medPriority" name="newtask-priority">
        <label for="newtask-highPriority" class="inlineblock">High</label>
        <input type="radio" id="newtask-highPriority" name="newtask-priority">
      </fieldset>
      
      <textarea id="newtask-notes" name="newtask-notes"
                rows="3" placeholder="Add additional notes here"></textarea>
      
      <label for="newtask-addChecklistCheck"  class="inlineblock">Add checklist?</label>
      <input type="checkbox" data-check="checklist" id="newtask-checklistCheck" name="newtask-addChecklistCheck">
      <input type="text" data-check="checklist" id="newtask-checklist" class="hide" name="newtask-checklist">

      <input type="submit" value="Add Task"></input>`;
  };

  const getForm = () => {
    let form = modal.querySelector('form');
    return form;
  };

  const getValue = (inputID) => {
    let form = getForm();
    let value = form.querySelector(`input[id="${inputID}"`).value;
    return value;
  };

  const getAllValues = () => {
    let form = getForm();
    let formValues = {};
    form.querySelectorAll(`input`).forEach(node => {
      if(node.getAttribute('type') === 'checkbox' || 
         node.getAttribute('type') === 'radio') {
        formValues[node.getAttribute('id')] = node.checked;
      } else {
        formValues[node.getAttribute('id')] = node.value;
      }      
    });
    
    return formValues;
  }

  const addErrorLabel = (elementID, errorText) => {
    let form = getForm();

    if(form.querySelector(`p[data-error="${elementID}"]`)) {

    } else {
      let elementPosition = form.querySelector(`#${elementID}`);
      let errorElement = document.createElement('p');
      errorElement.classList.add('modal-error');
      errorElement.dataset.error = elementID;
      errorElement.textContent = errorText;
      console.log(`element pos: ${elementPosition}`);
      form.insertBefore(errorElement, elementPosition.nextSibling);
    }
  }

  const trackCheckBox = (checkboxAndElementsID) => {
    let form = getForm();
    let elementsWithID = form.querySelectorAll(`input[data-check="${checkboxAndElementsID}"]`);
    let checkbox = null;
    let otherElements = [];
    elementsWithID.forEach(element => {
      let elementType = element.getAttribute('type');
      if(elementType === 'checkbox') {
        checkbox = element;
      } else {
        otherElements.push(element);
      }
    });

    checkbox.addEventListener('CheckboxStateChange', () => {
      otherElements.forEach(element => {
        if(checkbox.checked) {
          element.classList.remove('hide');
        } else {
          element.classList.add('hide');
        }
      });
    });
  }

  const trackSubmit = (functionToRun) => {
    if(!submitEventRegistered) {
      let form = getForm();
      form.addEventListener('submit', (e) => {e.preventDefault()});
      form.addEventListener('submit', functionToRun);
      submitEventRegistered = true;
    }    
  };

  resetForm();
  
  return Object.assign({}, prototype, {show, resetForm, getForm, getValue, getAllValues, trackCheckBox, trackSubmit, addErrorLabel});
})();

const EditTaskModal = ((content) => {
  let modalID = 1;
  const prototype = Modal('Edit Task', 1);
  let modal = document.querySelector(`div[data-modalid="${modalID}"]`);
  modal.innerHTML += `<form></form>`;

  let submitEventRegistered = false;

  const show = () => {
    prototype.show();
    prototype.focusFirstElement();
  }

  const resetForm = () => {
    let form = modal.querySelector('form');
    form.innerHTML =
      `<input type="text" id="newtask-name" name="newtask-name" placeholder="Task Name (e.g. eat cereals)" tabindex="0">
      <input type="text" id="newtask-desc"name="newtask-desc" placeholder="Description">
      <label for="newtask-addDueDateCheck" class="inlineblock">Add due date?</label>
      <input type="checkbox" data-check="duedate" id="newtask-dueDateCheck" name="newtask-addDueDateCheck">
      <input type="date" data-check="duedate" id="newtask-dueDate" class="hide" name="newtask-dueDate">
      
      <fieldset class="modal-priority">
        <p class="inlineblock">Priority:</p>
        <label for="newtask-lowPriority" class="inlineblock">Low</label>
        <input type="radio" id="newtask-lowPriority" name="newtask-priority" checked>
        <label for="newtask-medPriority" class="inlineblock">Medium</label>
        <input type="radio" id="newtask-medPriority" name="newtask-priority">
        <label for="newtask-highPriority" class="inlineblock">High</label>
        <input type="radio" id="newtask-highPriority" name="newtask-priority">
      </fieldset>
      
      <textarea id="newtask-notes" name="newtask-notes"
                rows="3" placeholder="Add additional notes here"></textarea>
      
      <label for="newtask-addChecklistCheck"  class="inlineblock">Add checklist?</label>
      <input type="checkbox" data-check="checklist" id="newtask-checklistCheck" name="newtask-addChecklistCheck">
      <input type="text" data-check="checklist" id="newtask-checklist" class="hide" name="newtask-checklist">

      <input type="submit" value="Edit Task"></input>`;
  };

  const getForm = () => {
    let form = modal.querySelector('form');
    return form;
  };

  const getValue = (inputID) => {
    let form = getForm();
    let value = form.querySelector(`input[id="${inputID}"`).value;
    return value;
  };

  const getAllValues = () => {
    let form = getForm();
    let formValues = {};
    form.querySelectorAll(`input`).forEach(node => {
      if(node.getAttribute('type') === 'checkbox' || 
         node.getAttribute('type') === 'radio') {
        formValues[node.getAttribute('id')] = node.checked;
      } else {
        formValues[node.getAttribute('id')] = node.value;
      }      
    });

    form.querySelectorAll(`textarea`).forEach(node => {
      formValues[node.getAttribute('id')] = node.value;   
    });
    
    return formValues;
  }

  const addErrorLabel = (elementID, errorText) => {
    let form = getForm();

    if(form.querySelector(`p[data-error="${elementID}"]`)) {

    } else {
      let elementPosition = form.querySelector(`#${elementID}`);
      let errorElement = document.createElement('p');
      errorElement.classList.add('modal-error');
      errorElement.dataset.error = elementID;
      errorElement.textContent = errorText;
      console.log(`element pos: ${elementPosition}`);
      form.insertBefore(errorElement, elementPosition.nextSibling);
    }
  }

  const trackCheckBox = (checkboxAndElementsID) => {
    let form = getForm();
    let elementsWithID = form.querySelectorAll(`input[data-check="${checkboxAndElementsID}"]`);
    let checkbox = null;
    let otherElements = [];
    elementsWithID.forEach(element => {
      let elementType = element.getAttribute('type');
      if(elementType === 'checkbox') {
        checkbox = element;
      } else {
        otherElements.push(element);
      }
    });

    checkbox.addEventListener('CheckboxStateChange', () => {
      otherElements.forEach(element => {
        if(checkbox.checked) {
          element.classList.remove('hide');
        } else {
          element.classList.add('hide');
          element.value = "";
        }
      });
    });
  }

  const populateForm = (toPopulateWith) => {
    let form = getForm();
    for (const [key, value] of Object.entries(toPopulateWith)) {
      let input = form.querySelector(`#${key}`);
      if(input) {
        if(input.getAttribute('type') === 'checkbox' || input.getAttribute('type') === 'radio') {
          if(value) {
            input.click();
          }
          input.checked = value;
        } else if(value === undefined) {
          input.value = "";
        }
        else {
          input.value = value;
        }
      }
      
      console.log(input);
    }
  }

  const trackSubmit = (functionToRun) => {
    if(!submitEventRegistered) {
      let form = getForm();
      form.addEventListener('submit', (e) => {e.preventDefault()});
      form.addEventListener('submit', functionToRun);
      submitEventRegistered = true;
    }    
  };

  resetForm();
  
  return Object.assign({}, prototype, {show, resetForm, getForm, populateForm, getValue, getAllValues, trackCheckBox, trackSubmit, addErrorLabel});
})();

const NewProjectModal = ((content) => {
  
})();*/

const AllModal = (modalTitle, modalID) => {
  
}

const Modal = (modalTitle, modalID) => {

}

const EditTaskModal = (modalTitle, modalID) => {
  
}

const NewTaskModal = (modalTitle, modalID) => {
  
}

const NewProjectModal = (modalTitle, modalID) => {
  
}

export {Modal, EditTaskModal, NewTaskModal, NewProjectModal};