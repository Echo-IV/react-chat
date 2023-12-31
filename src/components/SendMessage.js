import React, {useState} from "react";
import {auth, db} from "../firebase";
import "../App.css"

import {
    addDoc,
    collection,
    onSnapshot,
    query,
    serverTimestamp,
    deleteDoc,
    doc
} from "firebase/firestore";

const SendMessage = ({scroll, selectedUser}) => {

    const [message, setMessage] = useState("");

    const sendMessage = async (event) => {
        event.preventDefault();



        if(message.trim() !== "") {
            const {uid, displayName, photoURL} = auth.currentUser;


            if(selectedUser) {
                addDoc(collection(db,`users/messages/${selectedUser.uid}`), {
                    text: message,
                    name: displayName,
                    avatar: photoURL,
                    createdAt: serverTimestamp(),
                    uid,
                })
                setMessage("");
                return scroll.current.scrollIntoView({behavior: "smooth"});
            }








            await addDoc(collection(db, "messages"), {
                text: message,
                name: displayName,
                avatar: photoURL,
                createdAt: serverTimestamp(),
                uid,
            });
            setMessage("");
           return scroll.current.scrollIntoView({behavior: "smooth"});
        }

        // if (message.trim() === "") {
        //     alert("Enter valid message");
        //     return;
        // }

    };

    const handleClearAllMessage = async () => {

        const q = query(
            collection(db, "messages")
        );

        onSnapshot(q, (QuerySnapshot) => {

            QuerySnapshot.forEach((item) => {

                 const docRef = doc(db, "messages", item.id)

                setMessage([])

                return deleteDoc(docRef)
            });
        });
    };

    return (
        <>
        <form onSubmit={(event) => sendMessage(event)} className="send-message">
            <label htmlFor="messageInput" hidden>
                Enter Message
            </label>
            <input

                id="messageInput"
                name="messageInput"
                type="text"
                className="form-input"
                placeholder="type message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
            />
            <button type="submit">Send</button>
            <button className="button" onClick={handleClearAllMessage}>clear all message</button>

        </form>
        </>
    );
};

export default SendMessage;
