import PercentageCalculator from './components/PercentageCalculator'

function App() {
  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Percentage Calculator
        </h1>
        <PercentageCalculator />
      </div>
    </main>
  )
}

export default App
