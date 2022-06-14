import { useState } from 'react'
function App({ setJoin }) {

  return (
    <div>
        <button onClick={setJoin} className="text-gray-100 text-4xl bg-green-600 w-64 h-16 rounded shadow-lg transition-all hover:mb-2" >Join Room</button>
    </div>
  )
}

export default App
