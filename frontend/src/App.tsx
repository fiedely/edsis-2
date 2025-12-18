import { useState, useEffect } from 'react'

function App() {
  const [backendData, setBackendData] = useState<string>('Loading...')

  useEffect(() => {
    // Notice we just use '/api/health' - no domain, no localhost!
    // This works in Dev AND Production.
    fetch('/api/health')
      .then((response) => response.json())
      .then((data) => {
        setBackendData(data.message)
      })
      .catch((error) => {
        console.error('Error connecting to backend:', error)
        setBackendData('Failed to connect to backend.')
      })
  }, [])

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-gray-100 gap-4">
      <h1 className="text-4xl font-bold text-blue-600">
        Frontend + Backend Test
      </h1>
      <div className="p-6 bg-white rounded-xl shadow-lg border border-gray-200">
        <p className="text-gray-500 text-sm uppercase font-semibold tracking-wider mb-2">
          Backend Response:
        </p>
        <p className="text-2xl font-medium text-gray-800">
          {backendData}
        </p>
      </div>
    </div>
  )
}

export default App