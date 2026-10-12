export type TaskStatus = "todo" | "in-progress" | "done";

export interface Task {
  id: number;
  title: string;
  status: TaskStatus;
}

export function addTask(tasks: Task[], title: string, status: TaskStatus = "todo"): Task[] {
  const trimmed = title.trim();

  if (!trimmed) {
    return tasks;
  }

  return [
    ...tasks,
    {
      id: Date.now() + Math.random(),
      title: trimmed,
      status,
    },
  ];
}

export function filterByStatus(tasks: Task[], filter: "all" | TaskStatus): Task[] {
  if (filter === "all") {
    return tasks;
  }

  return tasks.filter((task) => task.status === filter);
}

export function updateTaskStatus(tasks: Task[], id: number, status: TaskStatus): Task[] {
  return tasks.map((task) => (task.id === id ? { ...task, status } : task));
}

export function deleteTask(tasks: Task[], id: number): Task[] {
  return tasks.filter((task) => task.id !== id);
}
