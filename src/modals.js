const AllModals = (() => {
  let allModals = [];

  const addModal = (modal) => {
    allModals.push(modal);
    return allModals.indexOf(modal);
  };

  const getModalIndex = (modal) => {
    return allModals.indexOf(modal);
  }

  const hideAllOtherModals = (modalToKeep) => {
    for(let i = 0; i < modalToKeep.length; i++) {
      if(i !== modalToKeep) {
        allModals[i].hide();
        console.log(`hiding modalID: ${i}`)
      } else {
        console.log(`keeping modalID: ${i}`)
      }
    }
  }

  return {addModal, getModalIndex, hideAllOtherModals};
})();

const Modal = (modalTitle) => {
  let modal = document.createElement('div');
  modal.classList.add('modal');
  modal.dataset.modalid = AllModals.addModal(modal);
  const modalID = AllModals.getModalIndex(modal);

  let modalContainer = document.createElement('div');
  modalContainer.classList.add('modal-container');
  modalContainer.dataset.modalid = modalID;

  //document.querySelector('body').appendChild(modalContainer);
  //document.querySelector('.modal-container').appendChild(modal);
  modalContainer.appendChild(modal);

  if(modalTitle.length > 0) {
    modal.innerHTML += `<h3 id="modal-title">${modalTitle}</h3>`;
  }

  const show = () => {
    modalContainer.classList.add('show');
    modal.classList.add('show');
    document.querySelector('body').appendChild(modalContainer);
  };

  const hide = () => {
    modalContainer.classList.remove('show');
    modal.classList.remove('show');
    modalContainer.remove();
  };

  const handleCloseModal = () => {
    modalContainer.addEventListener('click', (e) => {
      if(e.target.classList.contains('modal-container') || e.target.id === 'modal-close') {
        hide();
      } 
    });
  };

  const createCloseButton = (() => {
    modal.innerHTML += `<h3 id="modal-close">✕</h3>`;
    handleCloseModal();
  })();

  return {modal, show, hide};
}

const ConfirmCancelModal = (modalTitle, modalContent, confirmFunction, cancelFunction, confirmBtnText, cancelBtnText, isWarning = false) => {
  const prototype = Modal(modalTitle);
  if(modalContent.length > 0) {
    prototype.modal.innerHTML += `<p>${modalContent}</p>`;
  }
  if(!isWarning) {
    prototype.modal.innerHTML += `<button data-modalbtn="confirm" class="modal-btn modal-confirm-btn">${confirmBtnText}</button>`;
    prototype.modal.innerHTML += `<button data-modalbtn="cancel" class="modal-btn modal-cancel-btn">${cancelBtnText}</button>`;
  } else {
    prototype.modal.innerHTML += `<button data-modalbtn="confirm" class="modal-btn modal-confirm-btn-warn">${confirmBtnText}</button>`;
    prototype.modal.innerHTML += `<button data-modalbtn="cancel" class="modal-btn modal-cancel-btn-warn">${cancelBtnText}</button>`;
  }

  const trackButtons = (() => {
    let confirmBtn = prototype.modal.querySelector('button[data-modalbtn="confirm"]');
    let cancelBtn = prototype.modal.querySelector('button[data-modalbtn="cancel"]');
    confirmBtn.addEventListener('click', () => {
      confirmFunction();
      prototype.hide();
    });
    cancelBtn.addEventListener('click', () => {
      if(cancelFunction !== null) {
        cancelFunction();
      }      
      prototype.hide();
    });
    
  })();
  
  return Object.assign({}, prototype, {});
}

const PopupModal = (modalTitle, modalContent, okBtnText = "", okBtnFunction = null) => {
  const prototype = Modal(modalTitle);
  if(modalContent.length > 0) {
    prototype.modal.innerHTML += `<p>${modalContent}</p>`;
  }

  if(okBtnText.length > 0) {
    prototype.modal.innerHTML += `<button data-modalbtn="ok" class="modal-btn modal-confirm-btn">${okBtnText}</button>`;
  }

  const trackButtons = (() => {
    if(okBtnText.length > 0) {
      let okBtn = prototype.modal.querySelector('button[data-modalbtn="ok"]');

      okBtn.addEventListener('click', () => {
        if(okBtnFunction !== null) {
          okBtnFunction();
        }
        prototype.hide();
      });
    }    
  })();
  
  return Object.assign({}, prototype, {});
}

const FormModal = (modalTitle, submitFunction, cancelFunction, submitBtnText, cancelBtnText) => {
  const prototype = Modal(modalTitle);

  let initialHTML = `<form autocomplete="off">`;
  initialHTML += `<input type="submit" data-modalbtn="submit" class="modal-btn modal-confirm-btn" value="${submitBtnText}">`;
  if(cancelBtnText.length > 0) {
    initialHTML += `<button data-modalbtn="cancel" class="modal-btn modal-cancel-btn">${cancelBtnText}</button>`;
  } 
  initialHTML += `</form>`;
  prototype.modal.innerHTML += initialHTML;

  const trackButtons = () => {
    //let submitBtn = prototype.modal.querySelector('button[data-modalbtn="submit"]');
    let form = prototype.modal.querySelector('form');
    if(form) {
      form.addEventListener('submit', e => {
        e.preventDefault();
        let formData = new FormData(form);
        submitFunction(formData);
      });
    }    

    if(cancelBtnText.length > 0) {
      let cancelBtn = prototype.modal.querySelector('button[data-modalbtn="cancel"]');
      cancelBtn.addEventListener('click', () => {
        if(cancelFunction !== null) {
          cancelFunction();
        }
        prototype.hide();
      });
    }   
  };

  const focusFirstElement = () => {
    let firstInputElement = prototype.modal.querySelector('input');
    firstInputElement.focus();
  }

  const show = () => {
    prototype.show();
    focusFirstElement();
  }
  
  const addFormHTML = (formHTML) => {
    let form = prototype.modal.querySelector('form');
    form.remove();
    prototype.modal.innerHTML += initialHTML;
    form = prototype.modal.querySelector('form');
    form.innerHTML = formHTML + form.innerHTML;

    trackButtons();
  }

  const addErrorLabel = (errorText, inputID) => {
    let form = prototype.modal.querySelector('form');
    if(!form.querySelector(`p[data-error="${inputID}"]`)) {
      let elementPosition = form.querySelector(`#${inputID}`);
      let errorElement = document.createElement('p');
      errorElement.classList.add('modal-error');
      errorElement.dataset.error = inputID;
      errorElement.textContent = errorText;
      form.insertBefore(errorElement, elementPosition.nextSibling);
    }
  }

  const removeErrorLabel = (inputID) => {
    let labelToRemove = prototype.modal.querySelector(`p[data-error="${inputID}"]`);
    if(labelToRemove) {
      labelToRemove.remove();
    }
  }

  trackButtons();
  
  return Object.assign({}, prototype, {show, addFormHTML, addErrorLabel, removeErrorLabel});
}

/*

    <input type="text" id="modifytask-name" name="modifytask-name" placeholder="Task name">
    <input type="text" id="modifytask-desc" name="modifytask-desc" placeholder="Description"> 
    <label for="modifytask-duedate">Due date (optional):</labe>   
    <input type="date" id="modifytask-duedate" name="modifytask-duedate">
    <select id="modifytask-priority" name="modifytask-priority">
      <option value="low">low</option>
      <option value="med">med</option>
      <option value="high">high</option>
    </select>
    <textarea id="modifytask-notes" name="modifytask-notes" rows="3" placeholder="Add additional notes here"></textarea>

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
*/

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

export {AllModals, Modal, PopupModal, FormModal, ConfirmCancelModal};