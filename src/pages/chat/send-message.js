import styles from './styles.module.css';
import React, { useState } from 'react';
import {EVENT} from "./constants";

const SendMessage = ({ socket, username, room }) => {
    const [message, setMessage] = useState('');
    const sendImage = (eventTarget) => {
        const __createdtime__ = Date.now();
        const fileImage = eventTarget.files[0];
        console.log('fileImage ', fileImage)
        socket.emit(EVENT.SEND_IMAGE_EVENT, {
            username,
            room,
            fileImage,
            __createdtime__
        }, (status) => {
            console.log('status', status)
        });
    }

    const sendMessage = () => {
        if (message !== '') {
            const __createdtime__ = Date.now();
            // Send message to server. We can't specify who we send the message to from the frontend. We can only send to server. Server can then send message to rest of users in room
            socket.emit(EVENT.SEND_MESSAGE_EVENT, {
                username,
                room,
                message,
                __createdtime__
            });
            setMessage('');
        }
    };

    return (
        <div className={styles.sendMessageContainer}>
            <input
                className={styles.imageInput}
                placeholder='Image...'
                onChange={(e) => sendImage(e.target)}
                accept="image/*"
                type="file"
            />
            <input
                className={styles.messageInput}
                placeholder='Message...'
                onChange={(e) => setMessage(e.target.value)}
                value={message}
            />
            <button className='btn btn-primary' onClick={sendMessage}>
                Send Message
            </button>
        </div>
    );
};

export default SendMessage;