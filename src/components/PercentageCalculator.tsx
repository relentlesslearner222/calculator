import { useState } from 'react'
import { calculatePercentage } from '../utils/calculatePercentage'

function PercentageCalculator() {
  const [part, setPart] = useState('')
  const [whole, setWhole] = useState('')
  const [result, setResult] = useState('')

  const handlePartChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPart(e.target.value)
    setResult('')
  }

  const handleWholeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setWhole(e.target.value)
    setResult('')
  }

  const handleCalculate = () => {
    const partNum = parseFloat(part)
    const wholeNum = parseFloat(whole)
    if (isNaN(partNum) || isNaN(wholeNum)) {
      setResult('Please enter valid numbers')
      return
    }
    setResult(calculatePercentage(partNum, wholeNum))
  }

  const isError =
    result === 'Cannot divide by zero' || result === 'Please enter valid numbers'

  return (
    <div className="bg-white rounded-2xl shadow-md p-8 space-y-6">
      <div className="space-y-4">
        <div>
          <label
            htmlFor="part"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Part
          </label>
          <input
            id="part"
            type="number"
            value={part}
            onChange={handlePartChange}
            placeholder="e.g. 25"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label
            htmlFor="whole"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Whole
          </label>
          <input
            id="whole"
            type="number"
            value={whole}
            onChange={handleWholeChange}
            placeholder="e.g. 200"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <button
        onClick={handleCalculate}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
      >
        Calculate
      </button>

      {result && (
        <div
          role="status"
          className={`text-center text-lg font-semibold ${
            isError ? 'text-red-600' : 'text-green-600'
          }`}
        >
          {result}
        </div>
      )}
    </div>
  )
}

export default PercentageCalculator
