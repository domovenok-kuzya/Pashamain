import { useEffect, useState } from "react";

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

const StatsPage = () => {
  const [goals, setGoals] = useState<Goal[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("goals");
    if (saved) {
      const parsed: Goal[] = JSON.parse(saved);
      setGoals(parsed);
    }
  }, []);

  const getProgress = (steps?: Step[]) => {
    if (!steps || steps.length === 0) return 0;
    const done = steps.filter((s) => s.completed).length;
    return Math.round((done / steps.length) * 100);
  };

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6 text-black dark:text-white">
      <h1 className="text-3xl font-bold">📊 Аналитика по целям</h1>

      {goals.length === 0 ? (
        <p className="text-gray-500">Нет сохранённых целей.</p>
      ) : (
        goals.map((goal) => (
          <div
            key={goal.id}
            className="border rounded p-4 dark:border-gray-700 bg-white dark:bg-gray-900"
          >
            <h2 className="text-xl font-semibold">{goal.title}</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Выполнено: {getProgress(goal.steps)}%
            </p>
            <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded mt-2">
              <div
                className="h-3 bg-green-500 rounded"
                style={{ width: `${getProgress(goal.steps)}%` }}
              ></div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default StatsPage;