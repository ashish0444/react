import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import React from 'react';
import { db } from "../firebase";
import { CircleFadingPlusIcon, Loader2Icon, MessageSquare, SearchIcon, UserRoundIcon } from "lucide-react";
import Profile from "./Profile";
import UserCard from "./userCard";
import { useAuth } from "./AuthContext";

function ChatPanel() {
    const [users, setUsers] = useState([]);
    const [isLoading, setLoading] = useState(true);
    const [showProfile, setShowProfile] = useState(false);
    const { userData } = useAuth();
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        const getUsers = async () => {
            const data = await getDocs(collection(db, 'users'));
            const arrayOfUser = data.docs.map((docs) => ({ userData: docs.data(), id: docs.id }));
            setUsers(arrayOfUser);
            setLoading(false);
        };

        getUsers();
    }, []);

    const onBack = () => setShowProfile(false);

    if (showProfile) {
        return <Profile onBack={onBack} />;
    }

    let filteredUsers = users;

    if (searchQuery) {
        filteredUsers = users.filter((user) =>
            user.userData.name?.toLowerCase()?.includes(searchQuery.toLowerCase())
        );
    }

    return (
        <div className="bg-[#ffffff] w-[30vw] min-w-[350px] border border-gray-200 shadow-lg">
            {/* Top Bar */}
            <div className="bg-[#f0f0f0] py-3 px-4 border-b border-gray-300 flex justify-between items-center gap-2">
                <button onClick={() => setShowProfile(true)}>
                    <img
                        src={userData?.profile_pic || "/default-user.png"}
                        alt="profile"
                        className="w-10 h-10 rounded-full object-cover border-2 border-gray-400"
                    />
                </button>

                <div className="flex items-center justify-center gap-6">
                    <CircleFadingPlusIcon className="w-6 h-6 text-blue-500" />
                    <MessageSquare className="w-6 h-6 text-gray-600" />
                    <UserRoundIcon className="w-6 h-6 text-green-500" />
                </div>
            </div>

            {/* Chat List */}
            {isLoading ? (
                <div className="h-full w-full flex justify-center items-center">
                    <Loader2Icon className="w-10 h-10 text-blue-500 animate-spin" />
                </div>
            ) : (
                <div className="bg-white py-2 px-3">
                    <div className="bg-[#f7f7f7] flex items-center gap-4 px-3 py-2 rounded-lg border border-gray-300">
                        <SearchIcon className="w-4 h-4 text-gray-500" />
                        <input
                            className="bg-transparent focus:outline-none w-full text-gray-700"
                            placeholder="Search"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="divide-y py-4 h-full max-h-[calc(100vh-152px)] overflow-y-scroll">
                        {filteredUsers.map(userObject => (
                            <UserCard userObject={userObject} key={userObject.id} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default ChatPanel;
