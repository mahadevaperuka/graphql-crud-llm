import { useState } from 'react'
import axios from 'axios'
import './App.css'

interface ResponseData {
  success: boolean
  query: string
  variables: any
  result: any
  error: string | null
}

interface Output {
  question: string
  answer: ResponseData
  timestamp: Date
}

function App() {
  const [output, setOutput] = useState<Output | null>(null)
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const sendMessage = async () => {
    if (!inputValue.trim() || isLoading) return

    const currentInput = inputValue
    setInputValue('')
    setIsLoading(true)

    try {
      const response = await axios.post('http://localhost:3001/chat', {
        message: currentInput
      })

      const data = response.data
      
      // Create response object for better formatting
      let responseData = {
        success: false,
        query: '',
        variables: {},
        result: null,
        error: ''
      }

      if (data.llmResult === 'Success' && data.result) {
        responseData = {
          success: true,
          query: data.graphql.query,
          variables: data.graphql.variables,
          result: data.result,
          error: ''
        }
      } else if (data.llmResult === 'Error') {
        responseData = {
          success: false,
          query: '',
          variables: {},
          result: null,
          error: `LLM Error: ${data.graphql.error || 'Unknown error occurred'}`
        }
      } else if (data.error) {
        responseData = {
          success: false,
          query: '',
          variables: {},
          result: null,
          error: `Server Error: ${data.error}`
        }
      } else {
        responseData = {
          success: false,
          query: '',
          variables: {},
          result: null,
          error: `Unexpected response format: ${JSON.stringify(data, null, 2)}`
        }
      }

      const newOutput: Output = {
        question: currentInput,
        answer: responseData,
        timestamp: new Date()
      }
      setOutput(newOutput)

    } catch (error) {
      let errorMessage = 'Unknown error'
      
      if (axios.isAxiosError(error)) {
        if (error.response) {
          errorMessage = `Server Error (${error.response.status}): ${error.response.data?.error || error.message}`
        } else if (error.request) {

          errorMessage = `Network Error: No response from server`
        } else {
          errorMessage = `Request Error: ${error.message}`
        }
      } else if (error instanceof Error) {
        errorMessage = `Error: ${error.message}`
      }

      const errorOutput: Output = {
        question: currentInput,
        answer: {
          success: false,
          query: '',
          variables: {},
          result: null,
          error: `Connection error: ${errorMessage}`
        },
        timestamp: new Date()
      }
      setOutput(errorOutput)
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className="app">
      <div className="header">
        <h1>GraphQL-Chat</h1>
        <p>Ask me about characters and species in your database!</p>
      </div>

      <div className="query-container">
        <div className="input-section">
          <div className="input-container">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me about characters or species..."
              disabled={isLoading}
              className="query-input"
            />
            <button 
              onClick={sendMessage} 
              disabled={isLoading || !inputValue.trim()}
              className="submit-button"
            >
              {isLoading ? '⏳' : 'Submit'}
            </button>
          </div>
        </div>

        <div className="output-section">
          {!output && !isLoading && (
            <div className="welcome">
              <p>Hi! Try asking me:</p>
              <ul>
                <li>"Show me all characters"</li>
                <li>"Find characters named Luke"</li>
                <li>"Create a new character named _______"</li>
                <li>"Show all species"</li>
              </ul>
            </div>
          )}
          
          {isLoading && (
            <div className="output-container loading">
              <div className="process-header">
                <strong>Processing...</strong>
              </div>
            </div>
          )}

          {output && (
            <div className="output-container">
              <div className="output-header">
                <strong>Question:</strong>
                <span className="timestamp">{output.timestamp.toLocaleTimeString()}</span>
              </div>
              <div className="question-text">{output.question}</div>
              
              <div className="output-header">
                <strong>Response:</strong>
                <span className={`status ${output.answer.success ? 'success' : 'error'}`}>
                  {output.answer.success ? 'Success' : 'Error'}
                </span>
              </div>
              
              <div className="response-content">
                {output.answer.success ? (
                  <>
                    {output.answer.query && (
                      <div className="section">
                        <div className="section-header">GraphQL Query</div>
                        <div className="code-block graphql">
                          <pre>{output.answer.query}</pre>
                        </div>
                      </div>
                    )}
                    
                    {output.answer.variables && Object.keys(output.answer.variables).length > 0 && (
                      <div className="section">
                        <div className="section-header">Variables</div>
                        <div className="code-block graphql">
                          <pre>{JSON.stringify(output.answer.variables, null, 2)}</pre>
                        </div>
                      </div>
                    )}
                    
                    {output.answer.result && (
                      <div className="section">
                        <div className="section-header">Result</div>
                        <div className="code-block json">
                          <pre>{JSON.stringify(output.answer.result, null, 2)}</pre>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="error-section">
                    <div className="error-message">{output.answer.error}</div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default App
