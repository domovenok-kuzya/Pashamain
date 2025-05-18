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

interface Achievement {
  id: string;
  title: string;
  description: string;
  achieved: boolean;
}

const AchievementsPage = () => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("goals");
    const parsed: Goal[] = saved ? JSON.parse(saved) : [];
    const stepsDone = parsed.flatMap((g) => g.steps || []).filter((s) => s.completed);
    const completedGoals = parsed.filter((g) => {
      const steps = g.steps || [];
      return steps.length > 0 && steps.every((s) => s.completed);
    });

    const data: Achievement[] = [
      {
        id: "first-goal",
        title: "Первая завершённая цель",
        description: "Заверши хотя бы одну цель",
        achieved: completedGoals.length >= 1,
      },
      {
        id: "5-steps",
        title: "5 выполненных шагов",
        description: "Выполни 5 шагов",
        achieved: stepsDone.length >= 5,
      },
      {
        id: "first-step",
        title: "Первый шаг",
        description: "Заверши хотя бы один шаг",
        achieved: stepsDone.length >= 1,
      },
      {
        id: "10-steps",
        title: "10 выполненных шагов",
        description: "Выполни 10 шагов",
        achieved: stepsDone.length >= 10,
      },
      {
        id: "3-goals",
        title: "3 завершённых цели",
        description: "Заверши 3 цели полностью",
        achieved: completedGoals.length >= 3,
      },
    ];

    setAchievements(data);
  }, []);

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6 text-black dark:text-white">
      <h1 className="text-3xl font-bold">🏅 Достижения</h1>
      <p className="text-gray-600 dark:text-gray-400 text-sm">
        Завоюй как можно больше достижений!
      </p>

      <div className="space-y-4">
        {achievements.map((ach) => (
          <div
            key={ach.id}
            className={`p-4 border rounded ${
              ach.achieved
                ? "border-green-500 bg-green-50 dark:bg-green-900"
                : "border-gray-300 bg-white dark:bg-gray-800"
            }`}
          >
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-lg font-semibold">{ach.title}</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {ach.description}
                </p>
              </div>
              {ach.achieved && <span className="text-2xl">✅</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AchievementsPage;