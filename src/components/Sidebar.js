import React, {useEffect, useState} from 'react';
import '../Sidebar.css';
import "../App.css"
import {collection, query, onSnapshot} from "firebase/firestore";
import {auth, db} from "../firebase";

const Sidebar = ({setSelectedUser, selectedUser}) => {

    const [users, setUsers] = useState([]);
    const [textColor, setColor] = useState("white")

    const currentUser = auth.currentUser;

    function handleClick(user) {
        setColor("blue")
        setSelectedUser(user)
    }

    const getUsers = async () => {
        const q = query(
            collection(db, "users")
        );

        const unsubscribe = onSnapshot(q, (QuerySnapshot) => {
            const fetchedMessages = [];
            QuerySnapshot.forEach((doc) => {
                fetchedMessages.push({...doc.data()});
            });

            const sortedMessages = fetchedMessages.filter(
                (item) => item.uid !== currentUser.uid
            );

            setUsers(sortedMessages);
        });
        return () => unsubscribe;
    }

    useEffect(() => {
         getUsers()
    }, []);

    const renderUser = () => {
        return users.map((user) => {
            return (
                <div key={user.uid} onClick={() => handleClick(user)}><p style={{color: selectedUser?.uid === user?.uid ? textColor : "white"}}>{user.name}</p></div>
            )
        })
    }

    return (
        <div className="sidebar">
            {renderUser()}
            <button className="button" onClick={() => handleClick(null)}>Back to Primary Channel</button>
        </div>
    );
};

export default Sidebar;