import React, {useState} from "react";
import {auth, db} from "../firebase";



import {
    addDoc,
    collection,
    limit,
    onSnapshot,
    orderBy,
    query,
    serverTimestamp,
    deleteDoc,
    getFirestore, getDocs,
    doc
} from "firebase/firestore";

const SendMessage = ({scroll}) => {

    const dbs = getFirestore();

    const [message, setMessage] = useState("");

    const sendMessage = async (event) => {
        event.preventDefault();
        if (message.trim() === "") {
            alert("Enter valid message");
            return;
        }
        const {uid, displayName, photoURL} = auth.currentUser;
        await addDoc(collection(db, "messages"), {
            text: message,
            name: displayName,
            avatar: photoURL,
            createdAt: serverTimestamp(),
            uid,
        });
        setMessage("");
        scroll.current.scrollIntoView({behavior: "smooth"});
    };

    const handleClearAllMessage = async () => {

        // get All user message based on his id and then for loop and delete one

        const q = query(
            collection(db, "messages")
        );

        onSnapshot(q, (QuerySnapshot) => {

            QuerySnapshot.forEach((item) => {

                console.log(item, "item all")

                 const docRef = doc(db, "messages", item.id)
                //
                //
                //
                deleteDoc(docRef).then(() => {

                })


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
                className="form-input__input"
                placeholder="type message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
            />
            <button type="submit">Send</button>


        </form>

            <button onClick={handleClearAllMessage}>clear all message</button>


            {/*<button onClick={handleClearAllMessage}>Clear all messages</button>*/}




        </>
    );
};

export default SendMessage;
