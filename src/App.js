import { useEffect, useState } from 'react';
import './App.css';
import io from "socket.io-client";
import Chat from './Chat';

const socket = io.connect("http://localhost:4500")

function App() {
  const [username, setUsername] = useState('');
  const [showChat, setShowChat] = useState(false);
  const [liveUsers, setLiveUsers] = useState([]);

  const joinHandler = () => {
    if (username !== '') {
      socket.emit('join_room', username)
      setShowChat(true);
      //setUsername('');
    }
  }

  useEffect(() => {
    // whenever a new user is sent to backend, that user will be emitted by backend to frontend which we will get here
    socket.on('receive_user', (data) => {
      //console.log(data);
      setLiveUsers((currList) => {
        return [...currList, data]
      })
    })
  }, [socket])

  return (
    <div className="App">
      {!showChat ? (
        <div className='joinChatContainer'>
          <h3>Join Chat</h3>
          <input type='text' placeholder='please enter your username ..' onChange={(evt) => { setUsername(evt.target.value) }}></input>
          <button onClick={joinHandler}>Join</button>
        </div>

      ) : (
        <Chat socket={socket} username={username} liveUsers={liveUsers}></Chat>
      )}
    </div>
  );
}

export default App;
