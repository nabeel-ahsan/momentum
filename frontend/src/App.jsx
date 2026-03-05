import React from "react"
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import ListSessions from "./pages/ListSessions"
import LogIn from "./pages/LogIn"
import Register from "./pages/Register"
import AddSessions from "./pages/AddSessions"

function App() {
  return(
    <BrowserRouter>
      <Routes>
        <Route path="/login" element= {<LogIn/>}/>
        <Route path="/register" element= {<Register/>}/>
        <Route path="/app" element= {<ListSessions/>}/>
        <Route path="/add" element= {<AddSessions/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
