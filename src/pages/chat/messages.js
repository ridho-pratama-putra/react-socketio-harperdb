// client/src/pages/chat/messages.js

import styles from './styles.module.css';
import {useState, useEffect, useRef} from 'react';
import {EVENT} from "./constants";
import axios from "axios";

const Messages = ({socket}) => {
    const [messagesRecieved, setMessagesReceived] = useState([]);
    const messagesColumnRef = useRef(null);

    // Runs whenever a socket event is recieved from the server
    useEffect(() => {
        // console.log('useEffect receive_message ', messagesRecieved, socket);
        socket.on(EVENT.RECEIVE_MESSAGE_EVENT, (data) => {
            // console.log('socket on receive_message ');
            const {message, username, room, __createdtime__, type} = data;
            switch (type) {
                case 'media':
                    setMessagesReceived((state) => [
                        ...state,
                        {
                            message: message,
                            username: username,
                            __createdtime__: data.__createdtime__,
                            type: 'media'
                        },
                    ]);
                    axios.get("http://localhost:4000/file?filename=" + message).then((response) => {
                        console.log("http://localhost:4000/file?filename=" + message, response)
                    });
                    break;
                default:
                    setMessagesReceived((state) => [
                        ...state,
                        {
                            message: message,
                            username: username,
                            __createdtime__: data.__createdtime__,
                            type: 'text'
                        },
                    ]);
            }
        });
        // console.log('socket off receive_message ');

        // Remove event listener on component unmount
        return () => socket.off(EVENT.RECEIVE_MESSAGE_EVENT);
    }, [socket]);

    useEffect(() => {
        // console.log('useEffect last_100_messages');
        // Last 100 messages sent in the chat room (fetched from the db in backend)
        socket.on(EVENT.LAST_100_MESSAGES_EVENT, (last100Messages) => {
            // console.log('socket on Last 100 messages:');
            last100Messages = JSON.parse(last100Messages);
            // Sort these messages by __createdtime__
            last100Messages = sortMessagesByDate(last100Messages);
            setMessagesReceived((state) => [...last100Messages, ...state]);
        });

        // console.log('socket off Last 100 messages:');
        return () => socket.off(EVENT.LAST_100_MESSAGES_EVENT);
    }, [socket]);

    // Scroll to the most recent message
    useEffect(() => {
        // console.log('useEffect scrollTop');
        messagesColumnRef.current.scrollTop =
            messagesColumnRef.current.scrollHeight;
    }, [messagesRecieved]);

    function sortMessagesByDate(messages) {
        return messages.sort(
            (a, b) => parseInt(a.__createdtime__) - parseInt(b.__createdtime__)
        );
    }

    // dd/mm/yyyy, hh:mm:ss
    function formatDateFromTimestamp(timestamp) {
        const date = new Date(timestamp);
        return date.toLocaleString();
    }

    return (
        <div className={styles.messagesColumn} ref={messagesColumnRef}>
            {messagesRecieved.map((msg, i) => (
                <div className={styles.message} key={i}>
                    <div style={{display: 'flex', justifyContent: 'space-between'}}>
                        <span className={styles.msgMeta}>{msg.username}</span>
                        <span className={styles.msgMeta}>
                          {formatDateFromTimestamp(msg.__createdtime__)}
                        </span>
                    </div>
                    <p className={styles.msgText}>{msg.message}</p>
                    <br/>
                </div>
            ))}
        </div>
    );
};

export default Messages;