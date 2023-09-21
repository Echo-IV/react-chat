import {auth, db} from "./firebase";
import {useAuthState} from "react-firebase-hooks/auth";
import "./App.css";
import NavBar from "./components/NavBar";
import ChatBox from "./components/ChatBox";
import Welcome from "./components/Welcome";
import Sidebar from "./components/Sidebar";
import {useEffect, useState} from "react";
import {addDoc, collection, limit, onSnapshot, orderBy, query, serverTimestamp} from "firebase/firestore";

function App() {
    const [user] = useAuthState(auth);

    const [selectedUser, setSelectedUser] = useState(null);



    const saveUser = async () => {
        const {uid, photoURL, displayName} = user;

        const q = query(
            collection(db, "users")
        );

        const unsubscribe = onSnapshot(q, (QuerySnapshot) => {
            const fetchedMessages = [];
            QuerySnapshot.forEach((doc) => {
                fetchedMessages.push({...doc.data()});
            });

            const userAlreadyExist = fetchedMessages.find((item) => {
                return item.uid === uid;
            })

            if (!userAlreadyExist) {
                addDoc(collection(db, "users"), {
                    uid: uid,
                    avatar: photoURL,
                    name: displayName,
                });
            }
        });
    }

    useEffect(() => {
        saveUser();
    }, [user]);

    return (
        <div className="App">
            <NavBar/>
            {!user ? (
                <Welcome/>
            ) : (
                <>
                    <Sidebar setSelectedUser={setSelectedUser}/>
                    <ChatBox selectedUser={selectedUser}/>
                </>
            )}
        </div>
    );
}

export default App;
