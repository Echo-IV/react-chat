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

    console.log(selectedUser, "selec")

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
        const q = query(
            collection(db, "messages")
        )

        const a =  collection(db, "messages")

        const r = query(a, where("uid", "==", selectedUser.uid))

        console.log(r, "r")

        onSnapshot(r, (QuerySnapshot) => {

        //
            console.log(QuerySnapshot, "qwerty")

            QuerySnapshot.forEach((item) => {
                console.log(item.data(),"data" )


                 const docRef = doc(db, "messages", item.id);

                 console.log(docRef, "docRef")

                deleteDoc(docRef).then(() => {

                })

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
            {/* when a new message enters the chat, the screen scrolls down to the scroll div */}
            <span ref={scroll}></span>

            <SendMessage scroll={scroll}/>

            {selectedUser && <button onClick={handleClear}>clear message</button> }

        </main>
    );
};

export default ChatBox;
