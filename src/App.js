import './App.css';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import {useEffect, useState} from 'react';
import Home from './pages/home';
import io from 'socket.io-client';
import Chat from "./pages/chat";

const socket = io.connect('http://localhost:4000'); // our server will run on port 4000, so we connect to it from here

function App() {
    const [username, setUsername] = useState('');
    const [room, setRoom] = useState('');
    // console.log(`username -> ${username}`)
    // console.log(`room -> ${room}`)
    const beforeunload = (e) => {
        e.preventDefault();
        e.returnValue = true;
    }
    useEffect(() => {
        window.addEventListener('beforeunload', beforeunload.bind(this));
    })

    return (
        <Router>
            <div className='App'>
                <Routes>
                    <Route path='/' element={
                        <Home
                            username={username}
                            setUsername={setUsername}
                            room={room}
                            setRoom={setRoom}
                            socket={socket}
                        />
                    }/>
                    <Route
                        path='/chat'
                        element={<Chat username={username} room={room} socket={socket} />}
                    />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
