import {auth, db} from "./firebase";
import {useAuthState} from "react-firebase-hooks/auth";
import "./App.css";
import NavBar from "./components/NavBar";
import ChatBox from "./components/ChatBox";
import Welcome from "./components/Welcome";
import Sidebar from "./components/Sidebar";
import {useEffect, useState} from "react";
import {addDoc, collection, onSnapshot, query} from "firebase/firestore";
import PrivateMessage from "./components/PrivateMessage";

function App() {
    const [user] = useAuthState(auth);

    const [currentUser, setCurrentUser] = useState(null)

    const [selectedUser, setSelectedUser] = useState(null);
    const [messages, setMessages] = useState([]);

    const getUsers = async () => {
        const q = query(
            collection(db, "users")
        );

        const unsubscribe = onSnapshot(q, (QuerySnapshot) => {
            const fetchedMessages = [];
            QuerySnapshot.forEach((doc) => {
                fetchedMessages.push({...doc.data()});
            });

            const a = fetchedMessages.find((item) => {
                return user?.uid === item.uid
            })

            setCurrentUser(a);
        });
        return () => unsubscribe;

    }

    useEffect(() => {

        async function fetchData() {
            // You can await here

            if (user) {
                await getUsers()
            }
            // ...
        }

        fetchData();


    }, [user]);

    const saveUser = async () => {


        const q = query(
            collection(db, "users")
        );

        onSnapshot(q, (QuerySnapshot) => {
            const fetchedMessages = [];
            QuerySnapshot.forEach((doc) => {
                fetchedMessages.push({...doc.data()});
            });

            const userAlreadyExist = fetchedMessages.find((item) => {
                return item.uid === user?.uid;
            })

            if (!userAlreadyExist) {
                addDoc(collection(db, "users"), {
                    uid: user.uid,
                    avatar: user.photoURL,
                    name: user.displayName,
                    isAdmin: false
                });
            }
        });
    }

    const renderApp = () => {



        if (!user) {
            return (
                <Welcome/>
            )
        }
        if (currentUser?.isAdmin) {
            return (
                <>
                    <Sidebar selectedUser={selectedUser} setSelectedUser={setSelectedUser}/>
                    <ChatBox selectedUser={selectedUser}/>
                </>
            )
        }
        if(currentUser) {
           return <PrivateMessage messages={messages} selectedUser={currentUser}/>
        }
    }

    useEffect(() => {

        if(user) {
            saveUser();
        }
    }, [user]);

    return (
        <div className="App">
            <NavBar/>
            {renderApp()}
        </div>
    );
}

export default App;
