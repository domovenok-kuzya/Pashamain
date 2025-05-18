import { useRouter } from "next/router";
import { useState, useEffect } from "react";

const StepPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const stepId = parseInt(id as string);
  const [completed, setCompleted] = useState(false);

  // Мок-данные шага
  const step = {
    id: stepId,
    title: "Введение в HTML",
    description: "HTML — это язык разметки, на котором строятся все веб-страницы.",
    contentUrl: "https://developer.mozilla.org/ru/docs/Web/HTML",
  };

  useEffect(() => {
    const saved = localStorage.getItem("completedSteps");
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.includes(stepId)) {
        setCompleted(true);
      }
    }
  }, [stepId]);

  const handleComplete = () => {
    setCompleted(true);
    const saved = localStorage.getItem("completedSteps");
    let updated: number[] = saved ? JSON.parse(saved) : [];
    if (!updated.includes(stepId)) {
      updated.push(stepId);
      localStorage.setItem("completedSteps", JSON.stringify(updated));
    }
    alert("Шаг отмечен как выполненный ✅");
  };

  const handleBack = () => {
    router.back(); // или router.push(`/goal/1`) если хочешь явно
  };

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Шаг: {step.title}</h1>
      <p className="text-gray-700">{step.description}</p>

      <div>
        <a
          href={step.contentUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 underline"
        >
          Перейти к материалу
        </a>
      </div>

      {!completed ? (
        <button
          onClick={handleComplete}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Отметить как выполнено
        </button>
      ) : (
        <div className="text-green-700 font-semibold">✅ Выполнено</div>
      )}

      <div>
        <button
          onClick={handleBack}
          className="mt-4 text-sm text-blue-600 hover:underline"
        >
          ← Назад к маршруту
        </button>
      </div>
    </div>
  );
};

export default StepPage;