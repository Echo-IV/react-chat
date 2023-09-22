import React, {useEffect, useRef, useState} from "react";
import {
    query,
    where,
    collection,
    orderBy,
    onSnapshot,
    limit, doc, deleteDoc,
} from "firebase/firestore";
import {auth, db} from "../firebase";
import Message from "./Message";
import SendMessage from "./SendMessage";
import "../App.css"

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

            console.log(selectedUser, "selectedUser")


            if (!!selectedUser) {

                const {uid, displayName, photoURL} = auth.currentUser;

                const b  = query(
                    collection(db, `messages/${uid}/${selectedUser.uid}`)
                );

                onSnapshot(b, (item) => {
                    const c = [];
                    item.forEach((doc) => {
                        c.push({...doc.data(), id: doc.id});
                    });

                    console.log(c, "ccc")

                    return setMessages(c)
                })





                const a = sortedMessages.filter((msg) => msg.uid === selectedUser.uid);

                console.log(a, "a")


                return setMessages(a);
            }

            return setMessages(sortedMessages);
        });
        return () => unsubscribe;
    }, [selectedUser]);

    const handleClear = () => {
        const {uid, displayName, photoURL} = auth.currentUser;


        const message = collection(db, `messages/${uid}/${selectedUser.uid}`)

       // const r = query(message, where("uid", "==", selectedUser.uid))

        onSnapshot(message, (QuerySnapshot) => {

            QuerySnapshot.forEach((item) => {
                const docRef = doc(db, `messages/${uid}/${selectedUser.uid}` , item.id);

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
            <SendMessage selectedUser={selectedUser} scroll={scroll}/>
            {selectedUser && <button style={{position: "absolute", top: "200px"}} className="button" onClick={handleClear}>clear message</button>}
        </main>
    );
};
export default ChatBox;