import React, {useEffect, useState} from 'react';
import {collection, onSnapshot, query, where} from "firebase/firestore";
import {db} from "../firebase";
import "../App.css"

const PrivateMessage = ({ selectedUser }) => {

    const [messages, setMessages] = useState([])

    useEffect(() => {
        const privateMessage = query(
            collection(db, "messages"),
            where("uid", "!=", selectedUser.uid)
        )

        onSnapshot(privateMessage, (QuerySnapshot) => {
            const messages = []

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