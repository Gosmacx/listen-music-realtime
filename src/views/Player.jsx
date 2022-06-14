import { useState, useEffect } from 'react'
import socket from '../socket'
import PlayerControls from '../components/playerControls'
// Get Songs from API https://yapp-server.herokuapp.com/getSong?url=https://www.youtube.com/watch?v=dQw4w9WgXcQ
function App() {

  const [room, setRoom] = useState(null)
  var setTimer;

  useEffect(() => {

    let audioSRC = document.getElementById('audio')

    audioSRC.onloadeddata = () => {
      socket.emit('get-room')
    }

    audioSRC.onended = () => {
      audioSRC.play()
    }

    socket.on('room-info', (data) => {
      setRoom(data)
      if (data.partyState) socket.emit('get-song-info');
    })

    socket.on('song-info', (data) => {
      audioSRC.volume = 0.1
      if (data.time) audioSRC.currentTime = data.time
      if (data.isPlaying) audioSRC.play()
      setTimer = setInterval(() => {
        document.getElementById('myRange').value = audioSRC.currentTime * 100 / audioSRC.duration
      }, 500)
    })

    socket.on('give-info', (user) => {
      socket.emit('info-to-user', { time: audioSRC.currentTime, toUser: user })
    })

    socket.on('song-duration', data => {
      audioSRC.currentTime = data * audioSRC.duration / 100
    })

    return () => {
      socket.off('room-info')
      socket.off('song-info')
      socket.off('give-info')
      socket.off('song-duration')
    }
  }, [])

  const startParty = () => {
    socket.emit('start-party', socket.id)
  }

  const changeTime = (e) => {
    socket.emit('change-duration', e.target.value)
  }


  return (
    <div className='flex items-center justify-center h-screen w-full from-slate-600 to-slate-900 bg-gradient-to-tr bg-fixed flex-col gap-8' >
      <audio src="test.webm" id="audio" ></audio>
      <img className='rounded-lg shadow-lg' width={400} src="thumbnail.jpg" alt="" />
      { room?.partyState ?
        <PlayerControls changeTime={changeTime} /> :
        <button onClick={startParty} className="text-gray-100 text-4xl bg-green-600 w-64 h-16 rounded shadow-lg transition-all hover:scale-105" >Start Party</button>
      }
    </div>
  )
}

export default App
