import { ChangeEvent, useEffect, useState } from "react";

type CounterPropType = {
  value: number;
  onIncrement: () => void;
  onDecrement: () => void;
  onValueChange: (newValue: number) => void;
};

export default function Counter({
  value,
  onIncrement,
  onDecrement,
  onValueChange,
}: CounterPropType) {
  const [inputValue, setInputValue] = useState<string>(value.toString());

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    let newValue = event.target.value;

    if (/^\d*$/.test(newValue)) {
      if (newValue !== "" && parseInt(newValue, 10) > 999) {
        return;
      }
      onValueChange(parseInt(newValue || "0", 10));
    }
  };

  useEffect(() => {
    setInputValue(value.toString());
  }, [value]);

  return (
    <div className="flex items-center">
      <button
        type="button"
        id="decrement-button"
        onClick={onDecrement}
        className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-gray-300 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-700"
      >
        <svg
          className="h-2.5 w-2.5 text-gray-900 dark:text-white"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 18 2"
        >
          <path
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M1 1h16"
          />
        </svg>
      </button>
      <input
        type="text"
        id="counter-input"
        value={inputValue}
        onChange={handleInputChange}
        className="w-10 shrink-0 border-0 bg-transparent text-center text-sm font-medium text-gray-900 focus:outline-none focus:ring-0 dark:text-white"
        placeholder="0"
        required
      />
      <button
        type="button"
        id="increment-button"
        onClick={onIncrement}
        className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-gray-300 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-700"
      >
        <svg
          className="h-2.5 w-2.5 text-gray-900 dark:text-white"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 18 18"
        >
          <path
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 1v16M1 9h16"
          />
        </svg>
      </button>
    </div>
  );
}
