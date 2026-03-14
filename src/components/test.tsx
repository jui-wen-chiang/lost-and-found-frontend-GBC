import { useState } from 'react'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL;

export default function Test() {
      const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const testAPI = async () => {
    setLoading(true)
    setError('')
    setMessage('')

    try {
      const response = await axios.get(`${API_URL}/api/hello/`)
      setMessage(response.data.message)
    } catch (err: any) {
      setError('Failed to connect to backend: ' + err.message)
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      {/* <header className="App-header">
        <h1>Lost & Found Platform</h1>
        <p>Frontend Demo</p> */}
        <div className="card">
          <button onClick={testAPI} disabled={loading}>
            {loading ? 'Testing...' : 'Test Backend Connection'}
          </button>

          {message && (
            <div className="success">
              ✅ {message}
            </div>
          )}

          {error && (
            <div className="error">
              ❌ {error}
            </div>
          )}
        </div>

        <div className="info">
          <p>API URL: {API_URL}</p>
        </div>
      {/* </header> */}
    </div>
  )
}