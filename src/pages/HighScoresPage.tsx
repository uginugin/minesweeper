import { Link } from "react-router-dom"
import HighScoreTable from "../components/HighScoreTable/HighScoreTable"
import { gameModes } from "../helpers/gameModes"

const HighScoresPage = () => {
  const scoreTablesNames = (Object.values(gameModes)).map(v => v.name)
  return (
    <div>
      <div className="w-5/6 mx-auto">
        {scoreTablesNames.map((v) => (
          <HighScoreTable key={v} name={v} />
        ))}
      </div>
      <div className='mt-4'>
        <Link to='/'>Go home</Link>
      </div>
    </div>
  )
}
export default HighScoresPage