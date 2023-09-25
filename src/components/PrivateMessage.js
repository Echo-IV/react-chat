import React, {useEffect, useState} from 'react';
import {collection, onSnapshot, query, where} from "firebase/firestore";
import {auth, db, getDynamicCollection } from "../firebase";
import "../App.css"
import * as PropTypes from "prop-types";
import MessagePrivate from "./MessagePrivate";
import Message from "./Message";

MessagePrivate.propTypes = {message: PropTypes.any};
const PrivateMessage = ({ isDeleted }) => {

    //TODO add context to get notify when messages are deleted

    const {uid} = auth.currentUser;

    const [messages, setMessages] = useState([]);
     const dynamicCollectionId = `users/messages/${uid}`;

     const privateMessageCollection = getDynamicCollection(dynamicCollectionId);

     const messageCollection = query(collection(db, "messages"));

    useEffect(() => {
        const unsubscribe = onSnapshot(privateMessageCollection, (querySnapshot) => {
            const messages = [];
            querySnapshot.forEach((doc) => {
                messages.push(doc.data())
            })
            setMessages(prevData => [...prevData, ...messages]);
        })
        return () => unsubscribe();
    }, [uid, isDeleted]);

    useEffect(() => {
        const unsubscribe = onSnapshot(messageCollection, (querySnapshot) => {
            const messages = [];
            querySnapshot.forEach((doc) => {
                messages.push(doc.data())
            })
            setMessages(prevData => [...prevData, ...messages]);
        })
        return () => unsubscribe();
    }, [uid, isDeleted])

    return (
        <div style={{marginTop: 50}}>
            {messages.map((message) => (
                <MessagePrivate key={message.uid} message={message} />
            ))}
        </div>
    );
};

export default PrivateMessage;