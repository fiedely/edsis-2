import { useState, useEffect } from 'react'

function App() {
  const [backendData, setBackendData] = useState<string>('Loading...')

  useEffect(() => {
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
    <div className="flex h-screen w-full flex-col items-center justify-center bg-gray-50 gap-4 font-sans">
      <h1 className="text-4xl font-bold text-primary">
        Elementi Domus
      </h1>
      {/* This box should now have sharp corners (no rounded-xl) because we overrode it */}
      <div className="p-6 bg-white border border-gray-200 shadow-lg">
        <p className="text-gray-800 text-sm uppercase font-semibold tracking-wider mb-2">
          Backend Response:
        </p>
        <p className="text-2xl font-medium text-primary-dark">
          {backendData}
        </p>
      </div>
    </div>
  )
}

export default App