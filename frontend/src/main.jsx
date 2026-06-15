import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

// On récupère la div #root de l'index.html et on y monte l'application React
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)