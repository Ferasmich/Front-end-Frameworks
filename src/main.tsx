// Import React
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'


// Find the HTML element:
// <div id="root"></div>
// Then create a React root inside that element.
ReactDOM.createRoot(
  document.getElementById('root')!
).render(

  // Tell React to render our App component
  <React.StrictMode>
    <App />
  </React.StrictMode>

)
