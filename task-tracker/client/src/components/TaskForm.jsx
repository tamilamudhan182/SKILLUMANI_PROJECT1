import { useEffect, useState } from "react";

const initialState = {
  title: "",
  description: "",
};

function TaskForm({ onSubmit, editingTask, onCancel, busy }) {
  const [formData, setFormData] = useState(initialState);

  useEffect(() => {
    if (editingTask) {
      setFormData({
        title: editingTask.title,
        description: editingTask.description || "",
      });
    } else {
      setFormData(initialState);
    }
  }, [editingTask]);

  const handleChange = (event) => {
    setFormData((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await onSubmit(formData);

    if (!editingTask) {
      setFormData(initialState);
    }
  };

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <div className="form-header">
        <h2>{editingTask ? "Edit task" : "Create a task"}</h2>
        {editingTask ? (
          <button type="button" className="ghost-button" onClick={onCancel}>
            Cancel
          </button>
        ) : null}
      </div>

      <label>
        Title
        <input
          type="text"
          name="title"
          placeholder="What needs to get done?"
          value={formData.title}
          onChange={handleChange}
          required
        />
      </label>

      <label>
        Description
        <textarea
          name="description"
          placeholder="Add a short note"
          rows="4"
          value={formData.description}
          onChange={handleChange}
        />
      </label>

      <button type="submit" className="primary-button" disabled={busy}>
        {busy ? "Saving..." : editingTask ? "Update task" : "Add task"}
      </button>
    </form>
  );
}

export default TaskForm;
