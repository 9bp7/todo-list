const AllModals = (() => {
  let allModals = [];

  const addModal = (modal) => {
    allModals.push(modal);
    return allModals.indexOf(modal);
  };

  const getModalIndex = (modal) => {
    return allModals.indexOf(modal);
  };

  const hideAllOtherModals = (modalToKeep) => {
    for (let i = 0; i < modalToKeep.length; i++) {
      if (i !== modalToKeep) {
        allModals[i].hide();
      }
    }
  };

  return { addModal, getModalIndex, hideAllOtherModals };
})();

const Modal = (modalTitle, canBeDismissed = true) => {
  let modal = document.createElement("div");
  modal.classList.add("modal");
  modal.dataset.modalid = AllModals.addModal(modal);
  const modalID = AllModals.getModalIndex(modal);

  let modalContainer = document.createElement("div");
  modalContainer.classList.add("modal-container");
  modalContainer.dataset.modalid = modalID;

  modalContainer.appendChild(modal);

  if (modalTitle.length > 0) {
    modal.innerHTML += `<h3 id="modal-title">${modalTitle}</h3>`;
  }

  const show = () => {
    modalContainer.classList.add("show");
    modal.classList.add("show");
    document.querySelector("body").appendChild(modalContainer);
  };

  const hide = () => {
    modalContainer.classList.remove("show");
    modal.classList.remove("show");
    modalContainer.remove();
  };

  const handleCloseModal = () => {
    modalContainer.addEventListener("click", (e) => {
      if (
        e.target.classList.contains("modal-container") ||
        e.target.id === "modal-close"
      ) {
        if(canBeDismissed) {
          hide();
        }        
      }
    });
  };

  // eslint-disable-next-line
  const createCloseButton = (() => {
    modal.innerHTML += `<h3 id="modal-close">✕</h3>`;
    handleCloseModal();
  })();

  return { modal, show, hide };
};

const ConfirmCancelModal = (
  modalTitle,
  modalContent,
  confirmFunction,
  cancelFunction,
  confirmBtnText,
  cancelBtnText,
  isWarning = false
) => {
  const prototype = Modal(modalTitle);
  if (modalContent.length > 0) {
    prototype.modal.innerHTML += `<p>${modalContent}</p>`;
  }
  if (!isWarning) {
    prototype.modal.innerHTML += `<button data-modalbtn="confirm" class="modal-btn modal-confirm-btn">${confirmBtnText}</button>`;
    prototype.modal.innerHTML += `<button data-modalbtn="cancel" class="modal-btn modal-cancel-btn">${cancelBtnText}</button>`;
  } else {
    prototype.modal.innerHTML += `<button data-modalbtn="confirm" class="modal-btn modal-confirm-btn-warn">${confirmBtnText}</button>`;
    prototype.modal.innerHTML += `<button data-modalbtn="cancel" class="modal-btn modal-cancel-btn-warn">${cancelBtnText}</button>`;
  }

  // eslint-disable-next-line
  const trackButtons = (() => {
    let confirmBtn = prototype.modal.querySelector(
      'button[data-modalbtn="confirm"]'
    );
    let cancelBtn = prototype.modal.querySelector(
      'button[data-modalbtn="cancel"]'
    );
    confirmBtn.addEventListener("click", () => {
      confirmFunction();
      prototype.hide();
    });
    cancelBtn.addEventListener("click", () => {
      if (cancelFunction !== null) {
        cancelFunction();
      }
      prototype.hide();
    });
  })();

  return Object.assign({}, prototype, {});
};

const PopupModal = (
  modalTitle,
  modalContent,
  okBtnText = "",
  okBtnFunction = null,
  canBeDismissed = true
) => {
  const prototype = Modal(modalTitle, canBeDismissed);
  if (modalContent.length > 0) {
    prototype.modal.innerHTML += `<p>${modalContent}</p>`;
  }

  if (okBtnText.length > 0) {
    prototype.modal.innerHTML += `<button data-modalbtn="ok" class="modal-btn modal-confirm-btn">${okBtnText}</button>`;
  }

  // eslint-disable-next-line
  const trackButtons = (() => {
    if (okBtnText.length > 0) {
      let okBtn = prototype.modal.querySelector('button[data-modalbtn="ok"]');

      okBtn.addEventListener("click", () => {
        if (okBtnFunction !== null) {
          okBtnFunction();
        }
        prototype.hide();
      });
    }
  })();

  return Object.assign({}, prototype, {});
};

const FormModal = (
  modalTitle,
  submitFunction,
  cancelFunction,
  submitBtnText,
  cancelBtnText
) => {
  const prototype = Modal(modalTitle);

  let initialHTML = `<form autocomplete="off">`;
  initialHTML += `<input type="submit" data-modalbtn="submit" class="modal-btn modal-confirm-btn" value="${submitBtnText}">`;
  if (cancelBtnText.length > 0) {
    initialHTML += `<button data-modalbtn="cancel" class="modal-btn modal-cancel-btn">${cancelBtnText}</button>`;
  }
  initialHTML += `</form>`;
  prototype.modal.innerHTML += initialHTML;

  const trackButtons = () => {
    let form = prototype.modal.querySelector("form");
    if (form) {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        let formData = new FormData(form);
        submitFunction(formData);
      });
    }

    if (cancelBtnText.length > 0) {
      let cancelBtn = prototype.modal.querySelector(
        'button[data-modalbtn="cancel"]'
      );
      cancelBtn.addEventListener("click", () => {
        if (cancelFunction !== null) {
          cancelFunction();
        }
        prototype.hide();
      });
    }
  };

  const focusFirstElement = () => {
    let firstInputElement = prototype.modal.querySelector("input");
    firstInputElement.focus();
  };

  const show = () => {
    prototype.show();
    focusFirstElement();
  };

  const addFormHTML = (formHTML) => {
    let form = prototype.modal.querySelector("form");
    form.remove();
    prototype.modal.innerHTML += initialHTML;
    form = prototype.modal.querySelector("form");
    form.innerHTML = formHTML + form.innerHTML;

    trackButtons();
  };

  const addErrorLabel = (errorText, inputID) => {
    let form = prototype.modal.querySelector("form");
    if (!form.querySelector(`p[data-error="${inputID}"]`)) {
      let elementPosition = form.querySelector(`#${inputID}`);
      let errorElement = document.createElement("p");
      errorElement.classList.add("modal-error");
      errorElement.dataset.error = inputID;
      errorElement.textContent = errorText;
      form.insertBefore(errorElement, elementPosition.nextSibling);
    }
  };

  const removeErrorLabel = (inputID) => {
    let labelToRemove = prototype.modal.querySelector(
      `p[data-error="${inputID}"]`
    );
    if (labelToRemove) {
      labelToRemove.remove();
    }
  };

  trackButtons();

  return Object.assign({}, prototype, {
    show,
    addFormHTML,
    addErrorLabel,
    removeErrorLabel,
  });
};

export { AllModals, Modal, PopupModal, FormModal, ConfirmCancelModal };
