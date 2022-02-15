import React, { useEffect, useState } from 'react';

const Chat = ({ username, socket, liveUsers }) => {
    const [currentMessage, setCurrentMessage] = useState('');
    const [messageList, setMessageList] = useState([]);

    console.log(liveUsers)

    // we are making this function async because we need to wait for the msg to be sent to backend through socket before we move forward
    const sendMsgHandler = async () => {
        if (currentMessage !== '' && username !== '') {
            // we will require to send this msg to our socket
            const messageData = {
                author: username,
                message: currentMessage,
                time: new Date(Date.now()).getHours() + ":" + new Date(Date.now()).getMinutes()
            }

            //now we need to wait for socket to emit this message to our backend. check data in backend now
            await socket.emit('send_message', messageData)
        }
    }

    // In above handler we were emiting current msg from frontend to backend. Now we need to emit that msg to all users
    // so whenever there is a change in socket this will run
    // here we are going to use data which will be sent from backend to our frontend

    useEffect(() => {
        // whenever a new msg is sent to backend, that msg will be emitted by backend to frontend which we will get here
        socket.on('receive_message', (data) => {
            //console.log(data);
            setMessageList((currList) => {
                return [...currList, data]
            })
        })
    }, [socket])
    return (
        <div className='chat-main'>
            <div className='chat-window'>
                <div className='chat-header'>Live Chat</div>
                <div className='chat-body'>
                    {messageList.map((msg) => {
                        return (
                            <div className='message'>
                                <div>
                                    <div className='message-content'>
                                        <p>{msg.message}</p>
                                    </div>
                                    <div className='message-meta'>
                                        <p>{msg.author}</p>
                                        <p>{msg.time}</p>
                                    </div>
                                </div>
                            </div>
                        )
                    })}

                </div>
                <div className='chat-Footer'>
                    <input
                        type='text'
                        placeholder='pls type something here'
                        onChange={(evt) => {
                            setCurrentMessage(evt.target.value)
                        }}
                    ></input>
                    <button onClick={sendMsgHandler}>Send</button>
                </div>
            </div>
            <div className='live-users'>
                {liveUsers.map((user) => {
                    return <p>{user}</p>
                })}
            </div>
        </div>
    )
}

export default Chat;