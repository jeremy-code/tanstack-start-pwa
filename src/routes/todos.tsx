import { useState } from "react";

import { faker } from "@faker-js/faker";
import { createFileRoute } from "@tanstack/react-router";

type Todo = {
  id: string;
  isCompleted: boolean;
  description: string;
};

const createRandomTodo = (): Todo => ({
  id: faker.string.uuid(),
  isCompleted: faker.datatype.boolean(),
  description: faker.lorem.sentence({ min: 3, max: 8 }),
});

const createDefaultTodos = (): Todo[] =>
  [
    {
      isCompleted: false,
      description: "Buy osmanthus flowers and set sail with wine",
    },
    { isCompleted: false, description: "Travel 3106.8560 miles" },
    { isCompleted: true, description: "Live a hundred years in vain" },
    { isCompleted: false, description: "Find ten thousand things" },
    {
      isCompleted: true,
      description:
        "Fill innumerable worlds with the seven treasures and give it all away as gifts and alms",
    },
  ]
    .map<Todo>((t) => ({ id: crypto.randomUUID(), ...t }))
    .concat(Array.from({ length: 2 }, () => createRandomTodo()));

const TodosComponent = () => {
  const [todos, setTodos] = useState<Todo[]>(createDefaultTodos);

  return (
    <div className="container">
      <form
        className="flex max-w-sm"
        onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.target);
          const description = formData.get("description");

          if (description !== null && typeof description === "string") {
            setTodos((prev) => [
              ...prev,
              {
                isCompleted: false,
                description:
                  description !== ""
                    ? description
                    : createRandomTodo().description,
                id: crypto.randomUUID(),
              },
            ]);
          }
        }}
      >
        <input
          name="description"
          className="w-full shrink rounded-l-md border border-gray-600 p-1 text-sm"
          placeholder="Todo"
        />
        <button className="grow rounded-r-md border border-black bg-black p-1 text-sm text-white">
          Add
        </button>
      </form>

      <ol className="flex max-w-sm flex-col gap-2 p-4">
        {todos.map((todo) => (
          <li
            key={todo.id}
            className="flex max-w-full items-center justify-between gap-4"
          >
            <label className="flex items-center gap-4 text-sm leading-tight">
              <input
                type="checkbox"
                onChange={(e) =>
                  setTodos((prevTodos) =>
                    prevTodos.map((prevTodo) =>
                      prevTodo.id === todo.id
                        ? { ...prevTodo, isCompleted: e.target.checked }
                        : prevTodo,
                    ),
                  )
                }
                checked={todo.isCompleted}
              />
              {todo.description}
            </label>
            <button
              onClick={() =>
                setTodos((prevTodos) =>
                  prevTodos.filter((prevTodo) => prevTodo.id !== todo.id),
                )
              }
              className="h-6 rounded-md bg-red-600 p-0.5 text-xs text-red-50"
            >
              Delete
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
};

const Route = createFileRoute("/todos")({ component: TodosComponent });

export { Route };
