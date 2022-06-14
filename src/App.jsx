import { useState } from 'react'
import JoinScreen from './views/Join'
import PlayerScreen from './views/Player'

// Get Songs from API https://yapp-server.herokuapp.com/getSong?url=https://www.youtube.com/watch?v=dQw4w9WgXcQ
function App() {
  const [join, setJoin] = useState(false)


  return (
    <div className='flex items-center justify-center h-screen w-full from-slate-600 to-slate-900 bg-gradient-to-tr bg-fixed flex-col gap-8' >
      
      {join ? 
      <PlayerScreen/> :
      <JoinScreen setJoin={setJoin} />}

    </div>
  )
}

export default App
