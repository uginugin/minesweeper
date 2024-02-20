import { Link, Route, Routes } from 'react-router-dom'
import './App.css'
import GamePage from './pages/GamePage'
import HighScoresPage from './pages/HighScoresPage'


function App() {
  return (
    <div className='w-screen'>
      <Routes>
        <Route path='/' element={<GamePage />} />
        <Route path='highscores' element={<HighScoresPage />} />
        <Route path='*' element={
          <>
            <p>Похоже, страницы не существует...</p>
            <Link to='/'>Вернуться на главную</Link>
          </>
        } />
      </Routes>
    </div>
  )
}

export default App
