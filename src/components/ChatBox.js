import React, {useEffect, useRef, useState} from "react";
import {
    query,
    where,
    collection,
    orderBy,
    onSnapshot,
    limit, doc, deleteDoc,
} from "firebase/firestore";
import {db} from "../firebase";
import Message from "./Message";
import SendMessage from "./SendMessage";

const ChatBox = ({selectedUser}) => {

    const [messages, setMessages] = useState([]);
    const scroll = useRef();

    useEffect(() => {
        const q = query(
            collection(db, "messages"),
            orderBy("createdAt", "desc"),
            limit(50)
        );

        const unsubscribe = onSnapshot(q, (QuerySnapshot) => {
            const fetchedMessages = [];
            QuerySnapshot.forEach((doc) => {
                fetchedMessages.push({...doc.data(), id: doc.id});
            });
            const sortedMessages = fetchedMessages.sort(
                (a, b) => a.createdAt - b.createdAt
            );


            if (!!selectedUser) {
                const a = sortedMessages.filter((msg) => msg.uid === selectedUser.uid);


                return setMessages(a);
            }

            return setMessages(sortedMessages);
        });
        return () => unsubscribe;
    }, [selectedUser]);

    const handleClear = () => {
        const message = collection(db, "messages")

        const r = query(message, where("uid", "==", selectedUser.uid))

        onSnapshot(r, (QuerySnapshot) => {

            QuerySnapshot.forEach((item) => {
                const docRef = doc(db, "messages", item.id);

               return deleteDoc(docRef)

            })
        })
    }

    return (
        <main className="chat-box">
            <div className="messages-wrapper">
                {messages?.map((message) => (
                    <Message key={message.id} message={message}/>
                ))}
            </div>

            <span ref={scroll}></span>
            <SendMessage scroll={scroll}/>
            {selectedUser && <button onClick={handleClear}>clear message</button>}
        </main>
    );
};
export default ChatBox;