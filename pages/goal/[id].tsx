import { useEffect, useState } from "react";
import { useRouter } from "next/router";

interface Step {
  title: string;
  completed: boolean;
  plannedFor?: string;
}

interface Goal {
  id: number;
  title: string;
  steps?: Step[];
}

interface Resource {
  id: number;
  title: string;
  url: string;
  description: string;
}

const GoalPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [goal, setGoal] = useState<Goal | null>(null);
  const [resources, setResources] = useState<Resource[]>([]);
  const [editedStep, setEditedStep] = useState<number | null>(null);
  const [stepText, setStepText] = useState("");
  const [newStep, setNewStep] = useState("");

  useEffect(() => {
    if (!id) return;
  
    fetch(`http://localhost:8000/goals/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Ошибка при загрузке цели");
        return res.json();
      })
      .then((data: Goal) => {
        setGoal(data);
      })
      .catch((err) => {
        console.error(err);
        alert("Не удалось загрузить цель");
      });
  
    const savedResources = localStorage.getItem("resources");
    if (savedResources) {
      setResources(JSON.parse(savedResources));
    }
  }, [id]);

  const toggleStep = (index: number) => {
    if (!goal || !goal.steps) return;
    const updated = { ...goal };
    updated.steps[index].completed = !updated.steps[index].completed;
    setGoal(updated);
    save(updated);
  };

  const startEditing = (index: number) => {
    if (!goal || !goal.steps) return;
    setEditedStep(index);
    setStepText(goal.steps[index].title);
  };

  const saveEdit = () => {
    if (!goal || editedStep === null || !goal.steps) return;
    const updated = { ...goal };
    updated.steps[editedStep].title = stepText;
    setGoal(updated);
    setEditedStep(null);
    setStepText("");
    save(updated);
  };

  const addStep = async () => {
    if (!goal || newStep.trim() === "") return;
  
    try {
      const res = await fetch(`http://localhost:8000/goals/${goal.id}/steps`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          title: newStep,
          completed: false
        })
      });
  
      if (!res.ok) throw new Error("Ошибка добавления шага");
  
      const updated = await res.json();
      setGoal(updated);
      setNewStep("");
    } catch (err) {
      console.error(err);
      alert("Не удалось добавить шаг");
    }
  };

  const updateDate = (index: number, date: string) => {
    if (!goal || !goal.steps) return;
    const updated = { ...goal };
    updated.steps[index].plannedFor = date;
    setGoal(updated);
    save(updated);
  };

  const save = (updated: Goal) => {
    const all = localStorage.getItem("goals");
    if (!all) return;
    const parsed: Goal[] = JSON.parse(all);
    const index = parsed.findIndex((g) => g.id === updated.id);
    parsed[index] = updated;
    localStorage.setItem("goals", JSON.stringify(parsed));
    localStorage.setItem("currentGoal", JSON.stringify(updated));
  };

  if (!goal) return <div className="p-6">Загрузка...</div>;

  const sortedSteps = [...(goal.steps || [])].sort((a, b) => {
    if (a.completed === b.completed) return 0;
    return a.completed ? 1 : -1;
  });

  return (
    <div className="p-6 max-w-xl mx-auto space-y-6 text-black dark:text-white">
      <h1 className="text-2xl font-bold">{goal.title}</h1>

      <ul className="space-y-3">
        {sortedSteps.length ? (
          sortedSteps.map((step, index) => (
            <li
              key={index}
              className={`p-3 rounded border dark:border-gray-700 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 ${
                step.completed ? "bg-green-100 dark:bg-green-900" : "bg-white dark:bg-gray-800"
              }`}
            >
              <div className="flex-1">
                {editedStep === index ? (
                  <input
                    value={stepText}
                    onChange={(e) => setStepText(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && saveEdit()}
                    className="w-full p-1 text-sm bg-white dark:bg-gray-700 border dark:border-gray-600 rounded"
                  />
                ) : (
                  <span
                    className={`cursor-pointer ${step.completed ? "line-through" : ""}`}
                    onClick={() => toggleStep(index)}
                  >
                    {step.title}
                  </span>
                )}
                {step.plannedFor && (
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Запланировано на: {step.plannedFor}
                  </div>
                )}
              </div>

              <div className="flex gap-2 items-center">
                <input
                  type="date"
                  value={step.plannedFor || ""}
                  onChange={(e) => updateDate(index, e.target.value)}
                  className="text-sm p-1 border rounded dark:bg-gray-700 dark:border-gray-600"
                />

                {editedStep === index ? (
                  <button
                    onClick={saveEdit}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    Сохранить
                  </button>
                ) : (
                  <button
                    onClick={() => startEditing(index)}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    ✏️ Редактировать
                  </button>
                )}
              </div>
            </li>
          ))
        ) : (
          <p className="text-sm text-gray-500 dark:text-gray-400">Пока шагов нет.</p>
        )}
      </ul>

      <div className="pt-4 border-t border-gray-200 dark:border-gray-600">
        <input
          type="text"
          value={newStep}
          onChange={(e) => setNewStep(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addStep()}
          placeholder="Новый шаг..."
          className="w-full p-2 border rounded bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-sm"
        />
        <button
          onClick={addStep}
          className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          ➕ Добавить шаг
        </button>
      </div>

      {resources.length > 0 && (
        <div className="pt-6 border-t border-gray-300 dark:border-gray-600">
          <h2 className="text-xl font-semibold mb-2">📚 Полезные материалы</h2>
          <ul className="space-y-2">
            {resources.map((r) => (
              <li
                key={r.id}
                className="border p-3 rounded bg-white dark:bg-gray-800 dark:border-gray-700"
              >
                <a
                  href={r.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
                >
                  {r.title}
                </a>
                <p className="text-sm text-gray-600 dark:text-gray-400">{r.description}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default GoalPage;