import { useState } from 'react';

function AdditionCalculator() {
  const [num1, setNum1] = useState<number>(0);
  const [num2, setNum2] = useState<number>(0);
  const [result, setResult] = useState<number | null>(null);

  const handleAdd = () => setResult(num1 + num2);

  return (
    <div className="bg-white rounded-2xl shadow-md p-8 w-full max-w-sm flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <label htmlFor="num1">Number 1</label>
        <input
          id="num1"
          type="number"
          step="1"
          value={num1}
          onChange={(e) => {
            const parsed = parseInt(e.target.value, 10);
            setNum1(isNaN(parsed) ? 0 : parsed);
          }}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="num2">Number 2</label>
        <input
          id="num2"
          type="number"
          step="1"
          value={num2}
          onChange={(e) => {
            const parsed = parseInt(e.target.value, 10);
            setNum2(isNaN(parsed) ? 0 : parsed);
          }}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>
      <button
        onClick={handleAdd}
        className="bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg py-2 transition-colors"
      >
        Add
      </button>
      {result !== null && (
        <p className="text-center text-lg font-bold text-gray-700">Result: {result}</p>
      )}
    </div>
  );
}

export default AdditionCalculator;
