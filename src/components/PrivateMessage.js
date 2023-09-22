import React, {useEffect, useState} from 'react';
import {collection, onSnapshot, query, where} from "firebase/firestore";
import {auth, db} from "../firebase";
import "../App.css"

const PrivateMessage = ({ selectedUser }) => {

    const [messages, setMessages] = useState([])

    useEffect(() => {
        const {uid, displayName, photoURL} = auth.currentUser;

        const privateMessage = query(
            collection(db, "messages")
        )

        const g  = query(
            collection(db, `messages/${uid}/${selectedUser.uid}`)
        );

        const messages = []

        onSnapshot(g, (QuerySnapshot) => {


            QuerySnapshot.forEach((doc) => {

                console.log(doc, "aaaa")

                messages.push({ ...doc.data(), id:doc.id })
            })
        })

        onSnapshot(privateMessage, (QuerySnapshot) => {

            QuerySnapshot.forEach((doc) => {

                console.log(doc, "bbbb")

                messages.push({ ...doc.data(), id:doc.id })
            })

            setMessages(messages)
        })

    }, []);

    console.log(messages, "nmss")

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