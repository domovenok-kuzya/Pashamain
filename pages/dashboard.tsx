import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import ThemeToggle from "../components/ThemeToggle";

interface Goal {
  id: number;
  title: string;
}

const Dashboard = () => {
  const router = useRouter();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [currentGoal, setCurrentGoal] = useState<Goal | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editedTitle, setEditedTitle] = useState<string>("");

  useEffect(() => {
    fetch("http://localhost:8000/goals")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Ошибка при загрузке целей");
        }
        return res.json();
      })
      .then((data) => {
        setGoals(data);
        const active = data.find((goal: any) => goal.active);
        if (active) {
          setCurrentGoal(active);
        }
      })
      .catch((err) => console.error("Ошибка загрузки целей:", err));
  }, []);

  const handleGoToGoal = (id: number) => {
    router.push(`/goal/${id}`);
  };

  const handleCreate = () => {
    router.push("/goal/new");
  };

  const handleDelete = (id: number) => {
    const confirmed = confirm("Удалить эту цель?");
    if (!confirmed) return;

    const updatedGoals = goals.filter((goal) => goal.id !== id);
    localStorage.setItem("goals", JSON.stringify(updatedGoals));
    setGoals(updatedGoals);

    if (currentGoal?.id === id) {
      localStorage.removeItem("currentGoal");
      setCurrentGoal(null);
    }
  };

  const startEditing = (goal: Goal) => {
    setEditingId(goal.id);
    setEditedTitle(goal.title);
  };

  const saveEdit = (id: number) => {
    const updatedGoals = goals.map((goal) =>
      goal.id === id ? { ...goal, title: editedTitle } : goal
    );
    localStorage.setItem("goals", JSON.stringify(updatedGoals));
    setGoals(updatedGoals);

    if (currentGoal?.id === id) {
      const updatedCurrent = { ...currentGoal, title: editedTitle };
      localStorage.setItem("currentGoal", JSON.stringify(updatedCurrent));
      setCurrentGoal(updatedCurrent);
    }

    setEditingId(null);
    setEditedTitle("");
  };

  return (
    <div className="p-6 space-y-6 max-w-xl mx-auto text-black dark:text-white bg-white dark:bg-gray-900 min-h-screen">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Добро пожаловать!</h1>
        <ThemeToggle />
      </div>

      {currentGoal && (
        <div className="border dark:border-gray-700 rounded p-4 space-y-2">
          <h2 className="text-xl font-semibold">Твоя активная цель: {currentGoal.title}</h2>
          <button
            onClick={() => handleGoToGoal(currentGoal.id)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Продолжить обучение
          </button>
        </div>
      )}

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Все цели</h2>
        {goals.length > 0 ? (
          <div className="space-y-2">
            {goals.map((goal) => (
              <div
                key={goal.id}
                className="border dark:border-gray-700 p-3 rounded hover:bg-blue-50 dark:hover:bg-gray-800 flex justify-between items-center"
              >
                <div className="flex-1">
                  {editingId === goal.id ? (
                    <input
                      value={editedTitle}
                      onChange={(e) => setEditedTitle(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && saveEdit(goal.id)}
                      className="w-full p-1 text-sm bg-white dark:bg-gray-700 border dark:border-gray-600 rounded"
                    />
                  ) : (
                    <div
                      className="cursor-pointer"
                      onClick={() => handleGoToGoal(goal.id)}
                    >
                      <span>{goal.title}</span>
                      {currentGoal?.id === goal.id && (
                        <span className="text-green-600 text-sm ml-2">(активная)</span>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex gap-2 items-center ml-4">
                  {editingId === goal.id ? (
                    <button
                      onClick={() => saveEdit(goal.id)}
                      className="text-sm text-blue-600 hover:underline"
                    >
                      Сохранить
                    </button>
                  ) : (
                    <button
                      onClick={() => startEditing(goal)}
                      className="text-sm text-blue-600 hover:underline"
                    >
                      ✏️ Редактировать
                    </button>
                  )}

                  <button
                    onClick={() => handleDelete(goal.id)}
                    className="text-red-500 text-sm hover:underline"
                  >
                    Удалить
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 dark:text-gray-400">Целей пока нет.</p>
        )}
        <button
          onClick={handleCreate}
          className="text-sm text-blue-600 hover:underline"
        >
          Создать новую цель
        </button>
      </div>

      <div className="pt-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
        <button
          onClick={() => router.push("/stats")}
          className="text-sm text-indigo-600 hover:underline"
        >
          📊 Перейти к аналитике
        </button>
        <button
          onClick={() => router.push("/library")}
          className="text-sm text-indigo-600 hover:underline"
        >
          📚 Открыть библиотеку
        </button>
        <button
          onClick={() => router.push("/achievements")}
          className="text-sm text-indigo-600 hover:underline"
        >
          🏅 Посмотреть достижения
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
