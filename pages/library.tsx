import { useEffect, useState } from "react";

interface Resource {
  id: number;
  title: string;
  url: string;
  description: string;
}

const LibraryPage = () => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("resources");
    if (saved) setResources(JSON.parse(saved));
  }, []);

  const saveResources = (data: Resource[]) => {
    localStorage.setItem("resources", JSON.stringify(data));
  };

  const addResource = () => {
    if (!title || !url) return;
    const newResource: Resource = {
      id: Date.now(),
      title,
      url,
      description,
    };
    const updated = [...resources, newResource];
    setResources(updated);
    saveResources(updated);
    setTitle("");
    setUrl("");
    setDescription("");
  };

  const deleteResource = (id: number) => {
    const updated = resources.filter((r) => r.id !== id);
    setResources(updated);
    saveResources(updated);
  };

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6 text-black dark:text-white">
      <h1 className="text-3xl font-bold">📚 Библиотека</h1>

      <div className="space-y-2">
        <input
          type="text"
          placeholder="Название ресурса"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border rounded bg-white dark:bg-gray-700 dark:border-gray-600 text-sm"
        />
        <input
          type="url"
          placeholder="Ссылка на ресурс"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="w-full p-2 border rounded bg-white dark:bg-gray-700 dark:border-gray-600 text-sm"
        />
        <textarea
          placeholder="Краткое описание"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 border rounded bg-white dark:bg-gray-700 dark:border-gray-600 text-sm"
        />
        <button
          onClick={addResource}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          ➕ Добавить
        </button>
      </div>

      <div className="space-y-4">
        {resources.length === 0 ? (
          <p className="text-gray-500">Ресурсов пока нет.</p>
        ) : (
          resources.map((r) => (
            <div
              key={r.id}
              className="p-4 border rounded bg-white dark:bg-gray-900 dark:border-gray-700"
            >
              <a
                href={r.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-lg font-semibold text-blue-600 dark:text-blue-400 hover:underline"
              >
                {r.title}
              </a>
              <p className="text-sm text-gray-600 dark:text-gray-400">{r.description}</p>
              <button
                onClick={() => deleteResource(r.id)}
                className="text-sm text-red-500 hover:underline mt-2"
              >
                Удалить
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default LibraryPage;