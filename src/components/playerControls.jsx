import { useEffect, useState } from 'react'
import socket from '../socket'
function App({ changeTime }) {
    const [pause, setPause] = useState(true)

    useEffect(() => {
        let audioSRC = document.getElementById('audio')

        socket.on('song-playing', (data) => {
            if (data) {
                setPause(true)
                document.getElementById('musicState').src = "pause.svg"
                audioSRC.play()
            } else {
                setPause(false)
                document.getElementById('musicState').src = "play.svg"
                audioSRC.pause()
            }
        })

        return () => {
            socket.off('song-playing')
        }

    }, [])

    const setMusic = () => {
        socket.emit('change-playing', !pause)
    }


    return (
        <div className='flex flex-col items-center justify-center gap-8 relative' >
            <div className='flex items-center gap-4'>
                <img src="prev.svg" className='cursor-pointer' alt="" />
                <img id='musicState' src='pause.svg' onClick={setMusic} className='cursor-pointer' width={70} alt="" />
                <img src="next.svg" className='cursor-pointer' alt="" />
            </div>
            <input type="range" onInput={changeTime} min="1" max="100" className="slider !w-[400px] " id="myRange" />
        </div>
    )
}

export default App