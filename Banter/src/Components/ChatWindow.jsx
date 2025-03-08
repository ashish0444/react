import { MessageSquareText, PlusIcon, SendIcon } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../firebase';
import { arrayUnion, doc, getDoc, onSnapshot, setDoc, updateDoc } from 'firebase/firestore';
import { useAuth } from './AuthContext';

function ChatWindow() {
  const params = useParams();
  const [msg, setMsg] = useState("");
  const [secondUser, setSecondUser] = useState();
  const [msgList, setMsgList] = useState([]);
  const { userData } = useAuth();

  const receiverId = params?.chatid;
  const chatId =
    userData?.id > receiverId
      ? `${userData.id}-${receiverId}`
      : `${receiverId}-${userData?.id}`;

  const handleSendMsg = async () => {
    if (msg) {
      const date = new Date();
      const timeStamp = date.toLocaleString("en-US", {
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      });

      if (msgList?.length === 0) {
        await setDoc(doc(db, "user-chats", chatId), {
          chatId: chatId,
          messages: [
            {
              text: msg,
              time: timeStamp,
              sender: userData.id,
              receiver: receiverId,
            },
          ],
        });
      } else {
        await updateDoc(doc(db, "user-chats", chatId), {
          chatId: chatId,
          messages: arrayUnion({
            text: msg,
            time: timeStamp,
            sender: userData.id,
            receiver: receiverId,
          }),
        });
      }
      setMsg("");
    }
  };

  useEffect(() => {
    const getUser = async () => {
      const docRef = doc(db, "users", receiverId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setSecondUser(docSnap.data());
      }
    };
    getUser();

    const msgUnsubscribe = onSnapshot(doc(db, "user-chats", chatId), (doc) => {
      setMsgList(doc.data()?.messages || []);
    });

    return () => {
      msgUnsubscribe();
    };
  }, [receiverId]);

  if (!receiverId)
    return (
      <section style={{ width: "70%", height: "100%", display: "flex", flexDirection: "column", gap: "1rem", alignItems: "center", justifyContent: "center" }}>
        <MessageSquareText style={{ width: "7rem", height: "7rem", color: "#6B7280" }} strokeWidth={1.2} />
        <p style={{ fontSize: "0.875rem", textAlign: "center", color: "#6B7280" }}>
          Select any contact to <br />
          start a chat with.
        </p>
      </section>
    );

  return (
    <section style={{ width: "70%", height: "100%", display: "flex", flexDirection: "column", gap: "1rem", alignItems: "center", justifyContent: "center" }}>
      <div style={{ height: "100%", width: "100%", backgroundColor: "#F0F2F5", display: "flex", flexDirection: "column" }}>
        {/* Topbar */}
        <div style={{ backgroundColor: "#FFFFFF", padding: "0.5rem 1rem", display: "flex", alignItems: "center", gap: "0.5rem", boxShadow: "0px 1px 3px #D1D5DB" }}>
          <img
            src={secondUser?.profile_pic || "/default-user.png"}
            alt="profile picture"
            style={{ width: "2.25rem", height: "2.25rem", borderRadius: "50%", objectFit: "cover" }}
          />
          <div>
            <h3 style={{ color: "#111827" }}>{secondUser?.name}</h3>
            {secondUser?.lastSeen && (
              <p style={{ fontSize: "0.75rem", color: "#6B7280" }}>
                Last seen at {secondUser?.lastSeen}
              </p>
            )}
          </div>
        </div>

        {/* Message List */}
        <div style={{ flexGrow: 1, display: "flex", flexDirection: "column", gap: "3rem", padding: "1.5rem", overflowY: "scroll" }}>
          {msgList?.map((m, index) => (
            <div
              key={index}
              data-sender={m.sender === userData.id}
              style={{
                backgroundColor: m.sender === userData.id ? "#DCF8C6" : "#FFFFFF",
                maxWidth: "400px",
                wordBreak: "break-word",
                borderRadius: "0.375rem",
                padding: "0.5rem",
                boxShadow: "0px 1px 3px #D1D5DB",
                alignSelf: m.sender === userData.id ? "flex-end" : "flex-start",
              }}
            >
              <p style={{ color: "#111827" }}>{m?.text}</p>
              <p style={{ fontSize: "0.75rem", color: "#6B7280", textAlign: "right" }}>
                {m?.time}
              </p>
            </div>
          ))}
        </div>

        {/* Chat Input */}
        <div style={{ backgroundColor: "#FFFFFF", padding: "0.75rem 1.5rem", boxShadow: "0px -1px 3px #D1D5DB", display: "flex", alignItems: "center", gap: "1.5rem" }}>
          <PlusIcon style={{ color: "#6B7280" }} />
          <input
            type="text"
            style={{ width: "100%", padding: "0.5rem 1rem", borderRadius: "0.375rem", backgroundColor: "#E5E7EB", border: "none", outline: "none" }}
            placeholder="Type a message..."
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSendMsg();
              }
            }}
          />
          <button onClick={handleSendMsg} style={{ backgroundColor: "#10B981", borderRadius: "50%", padding: "0.5rem", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <SendIcon style={{ color: "#FFFFFF" }} />
          </button>
        </div>
      </div>
    </section>
  );
}

export default ChatWindow;
