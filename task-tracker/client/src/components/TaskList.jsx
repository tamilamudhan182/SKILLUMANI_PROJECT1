function TaskList({ tasks, onEdit, onDelete, onToggle, loading }) {
  if (loading) {
    return <div className="card">Loading tasks...</div>;
  }

  if (!tasks.length) {
    return (
      <div className="card empty-state">
        <h3>No tasks found</h3>
        <p>Create a task or switch filters to see more items.</p>
      </div>
    );
  }

  return (
    <div className="task-table-wrapper card">
      <table className="task-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Status</th>
            <th>Created</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr key={task._id}>
              <td>{task.title}</td>
              <td>{task.description || "No description"}</td>
              <td>
                <span className={`status-pill ${task.status}`}>{task.status}</span>
              </td>
              <td>{new Date(task.createdAt).toLocaleDateString()}</td>
              <td className="actions-cell">
                <button type="button" className="ghost-button" onClick={() => onToggle(task)}>
                  {task.status === "complete" ? "Mark pending" : "Mark complete"}
                </button>
                <button type="button" className="ghost-button" onClick={() => onEdit(task)}>
                  Edit
                </button>
                <button type="button" className="danger-button" onClick={() => onDelete(task._id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TaskList;
