import {useState, useEffect} from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch('/api/currentDate')
      .then(response => response.text())
      .then(message => {
        console.log("message> ?", message)
        setMessage(message);
      });
  }, []);


  return (
    <>
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">{message}</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
      </div>
    </>
  )
}

export default App
