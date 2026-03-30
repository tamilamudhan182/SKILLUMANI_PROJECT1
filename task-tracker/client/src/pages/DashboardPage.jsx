import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import TaskForm from "../components/TaskForm";
import TaskList from "../components/TaskList";

const filters = ["all", "pending", "complete"];

function DashboardPage() {
  const { user, logout } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [error, setError] = useState("");

  const fetchTasks = async (selectedFilter = filter) => {
    setLoading(true);

    try {
      const { data } = await api.get("/tasks", {
        params: {
          status: selectedFilter,
        },
      });
      setTasks(data);
      setError("");
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to load tasks.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks(filter);
  }, [filter]);

  const handleSubmit = async (values) => {
    setBusy(true);

    try {
      if (editingTask) {
        await api.put(`/tasks/${editingTask._id}`, values);
        setEditingTask(null);
      } else {
        await api.post("/tasks", values);
      }

      await fetchTasks(filter);
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to save task.");
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async (taskId) => {
    try {
      await api.delete(`/tasks/${taskId}`);
      await fetchTasks(filter);
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to delete task.");
    }
  };

  const handleToggle = async (task) => {
    try {
      await api.patch(`/tasks/${task._id}/toggle`);
      await fetchTasks(filter);
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to update task status.");
    }
  };

  return (
    <div className="dashboard-page">
      <header className="dashboard-header card">
        <div>
          <p className="eyebrow">Dashboard</p>
          <h1>{user?.name ? `${user.name}'s Tasks` : "Your Tasks"}</h1>
          <p className="muted-text">Create, edit, filter, and complete tasks from one place.</p>
        </div>

        <button type="button" className="ghost-button" onClick={logout}>
          Logout
        </button>
      </header>

      <section className="dashboard-grid">
        <TaskForm
          onSubmit={handleSubmit}
          editingTask={editingTask}
          onCancel={() => setEditingTask(null)}
          busy={busy}
        />

        <div className="tasks-panel">
          <div className="card toolbar">
            <div>
              <h2>Tasks</h2>
              <p className="muted-text">Filter tasks by progress and update them quickly.</p>
            </div>

            <div className="filter-group">
              {filters.map((item) => (
                <button
                  key={item}
                  type="button"
                  className={filter === item ? "filter-button active" : "filter-button"}
                  onClick={() => setFilter(item)}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {error ? <p className="error-banner">{error}</p> : null}

          <TaskList
            tasks={tasks}
            onEdit={setEditingTask}
            onDelete={handleDelete}
            onToggle={handleToggle}
            loading={loading}
          />
        </div>
      </section>
    </div>
  );
}

export default DashboardPage;
