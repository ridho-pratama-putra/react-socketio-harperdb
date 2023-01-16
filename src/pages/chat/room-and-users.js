import styles from './styles.module.css';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {EVENT} from "./constants";

const RoomAndUsers = ({ socket, username, room }) => {
    const [roomUsers, setRoomUsers] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        socket.on(EVENT.CHAT_ROOM_USERS_EVENT, (data) => {
            setRoomUsers(data);
        });

        return () => socket.off(EVENT.CHAT_ROOM_USERS_EVENT);
    }, [socket]);

    const leaveRoom = () => {
        const __createdtime__ = Date.now();
        socket.emit(EVENT.LEAVE_ROOM_EVENT, { username, room, __createdtime__ });
        // Redirect to home page
        navigate('/', { replace: true });
    };

    return (
        <div className={styles.roomAndUsersColumn}>
            <h2 className={styles.roomTitle}>{room}</h2>

            <div>
                {roomUsers.length > 0 && <h5 className={styles.usersTitle}>Users:</h5>}
                <ul className={styles.usersList}>
                    {roomUsers.map((user) => (
                        <li
                            style={{
                                fontWeight: `${user.username === username ? 'bold' : 'normal'}`,
                            }}
                            key={user.id}
                        >
                            {user.username}
                        </li>
                    ))}
                </ul>
            </div>

            <button className='btn btn-outline' onClick={leaveRoom}>
                Leave
            </button>
        </div>
    );
};

export default RoomAndUsers;