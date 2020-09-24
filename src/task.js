const ToDoItem = (title, description, dueDate, priority, notes, checklist) => {
  let completed = false;
  let completionDate = null;
  let creationDate = Date.now();

  const setTitle = (newTitle) => (title = newTitle);
  const setDescription = (newDescription) => (description = newDescription);
  const setDueDate = (newDueDate) => (dueDate = newDueDate);
  const setPriority = (newPriority) => (priority = newPriority);
  const setNotes = (newNotes) => (notes = newNotes);
  const setChecklist = (newChecklist) => (checklist = newChecklist);
  const setComplete = (isComplete) => {
    completed = isComplete;
    if (isComplete) {
      completionDate = Date.now();
    }
  };
  const setCompletionDate = (newCompletionDate) =>
    (completionDate = newCompletionDate);
  const setCreationDate = (newCreationDate) => (creationDate = newCreationDate);

  const getTitle = () => title;
  const getDescription = () => description;
  const getDueDate = () => dueDate;
  const getPriority = () => priority;
  const getNotes = () => notes;
  const getChecklist = () => checklist;
  const getComplete = () => completed;
  const getCompletionDate = () => completionDate;
  const getCreationDate = () => creationDate;
  const getJSON = () => {
    let data = {};
    data.title = title;
    data.description = description;
    data.dueDate = dueDate;
    data.priority = priority;
    data.notes = notes;
    data.checklist = checklist;
    data.completed = completed;
    data.completionDate = completionDate;
    data.creationDate = creationDate;
    return JSON.stringify(data);
  };
  return {
    getJSON,
    setComplete,
    getComplete,
    getCompletionDate,
    getCreationDate,
    setCompletionDate,
    setCreationDate,
    setTitle,
    setDescription,
    setDueDate,
    setPriority,
    setNotes,
    setChecklist,
    getTitle,
    getDescription,
    getDueDate,
    getPriority,
    getNotes,
    getChecklist,
  };
};

export { ToDoItem };
