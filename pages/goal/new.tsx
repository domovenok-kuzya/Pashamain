import { useState } from "react";
import { useRouter } from "next/router";

const GoalCreationPage = () => {
  const router = useRouter();
  const [goalTitle, setGoalTitle] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  const templates = [
    "Frontend-разработчик",
    "Data Scientist",
    "Английский язык",
    "Основы программирования",
  ];

  const handleCreate = async () => {
    const finalTitle = selectedTemplate || goalTitle;
    if (!finalTitle) return alert("Введите или выберите цель");
  
    try {
      const res = await fetch("http://localhost:8000/goals", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: finalTitle,
          steps: [],
        }),
      });
  
      if (!res.ok) throw new Error("Ошибка при создании цели");
  
      const data = await res.json();
      router.push(`/goal/${data.id}`);
    } catch (err) {
      console.error("Ошибка при отправке запроса:", err);
      alert("Не удалось создать цель");
    }
  };
  return (
    <div className="p-6 space-y-6 max-w-xl mx-auto font-sans">
      <h1 className="text-2xl font-bold">Создай свою цель обучения</h1>

      <div className="space-y-2">
        <label className="font-medium">Выбери шаблон цели:</label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {templates.map((template) => (
            <button
              key={template}
              className={`p-2 border rounded ${
                selectedTemplate === template
                  ? "bg-blue-600 text-white"
                  : "bg-white hover:bg-blue-100"
              }`}
              onClick={() => setSelectedTemplate(template)}
            >
              {template}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <label className="font-medium">Или введи свою цель:</label>
        <input
          type="text"
          placeholder="Например: Изучить TypeScript"
          className="w-full p-2 border rounded"
          value={goalTitle}
          onChange={(e) => setGoalTitle(e.target.value)}
        />
      </div>

      <div>
        <button
          onClick={handleCreate}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Создать маршрут
        </button>
      </div>
    </div>
  );
};

export default GoalCreationPage;