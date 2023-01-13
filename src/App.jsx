import { useState } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'
import Navbar from './components/Navbar'
import Tagbar from './components/Tagbar'
import Note from './components/Note'
import NotesList from './components/NotesList';

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="App">
      <Navbar />
      <Tagbar />
      <NotesList />
    </div>
  )
}

export default App
