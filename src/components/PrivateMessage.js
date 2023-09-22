import React, {useEffect, useState} from 'react';
import {collection, onSnapshot, query, where} from "firebase/firestore";
import {auth, db} from "../firebase";
import "../App.css"

const PrivateMessage = ({ selectedUser }) => {

    const [messages, setMessages] = useState([])

    useEffect(() => {
        const {uid, displayName, photoURL} = auth.currentUser;

        const privateMessage = query(
            collection(db, "messages"),
            where("uid", "!=", selectedUser.uid)
        )

        const g  = query(
            collection(db, `messages/${uid}/${selectedUser.uid}`)
        );

        const messages = []

        onSnapshot(g, (QuerySnapshot) => {


            QuerySnapshot.forEach((doc) => {
                messages.push({ ...doc.data(), id:doc.id })
            })
        })

        onSnapshot(privateMessage, (QuerySnapshot) => {

            QuerySnapshot.forEach((doc) => {
                messages.push({ ...doc.data(), id:doc.id })
            })

            setMessages(messages)
        })

    }, []);

    const renderMessages = () => {
        return messages.map((message) => {
            return (
                <div className="text-private">{message.text}</div>
            )
        })
    }

    return (
        <>
            {renderMessages()}
        </>
    );
};

export default PrivateMessage;