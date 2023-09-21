import React, {useEffect, useState} from 'react';
import '../Sidebar.css';
import {collection, limit, orderBy, query, getDocs, onSnapshot} from "firebase/firestore";
import {auth, db} from "../firebase"; // You'll create this CSS file



const Sidebar = ({setSelectedUser}) => {

    const [users, setUsers] = useState([])

    const currentUser = auth.currentUser;

    function handleClick(user) {
        setSelectedUser(user)
    }

    const getUsers = async () => {
        const q = query(
            collection(db, "users")
            // orderBy("createdAt", "desc"),
            // limit(50)
        );

        const unsubscribe = onSnapshot(q, (QuerySnapshot) => {
            const fetchedMessages = [];
            QuerySnapshot.forEach((doc) => {
                fetchedMessages.push({ ...doc.data() });
            });

            //
            const sortedMessages = fetchedMessages.filter(
                (item) => item.uid !== currentUser.uid
            );



            setUsers(sortedMessages);
        });
        return () => unsubscribe;


        // console.log(await getDocs(q), "q")

        // const user = auth.currentUser;
        //
        // console.log(user, "user")

        // setUsers(user)
    }


    useEffect(() => {
        getUsers()
    }, []);

    console.log(users, "iuserrs")

    const renderUser = () => {



        return users.map((user) => {
            return (
                <div onClick={()=> handleClick(user)}><img src={user.avatar} alt="Avatar" /></div>
            )
        })
    }


    return (
        <div className="sidebar">
            <div className="avatar">
                {renderUser()}
            </div>
            <div className="sidebar-content">

                {/* Add your chat contacts or other sidebar content here */}
            </div>
        </div>
    );
};

export default Sidebar;