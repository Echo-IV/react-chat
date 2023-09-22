import React, {useEffect, useState} from 'react';
import '../Sidebar.css';
import "../App.css"
import {collection, query, onSnapshot} from "firebase/firestore";
import {auth, db} from "../firebase";

const Sidebar = ({setSelectedUser}) => {

    const [users, setUsers] = useState([])

    const currentUser = auth.currentUser;

    function handleClick(user) {
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
                <div onClick={() => handleClick(user)}>{user.name}</div>
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