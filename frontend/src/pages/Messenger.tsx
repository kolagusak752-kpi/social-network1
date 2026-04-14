import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import Loader from "../components/Loading/Loader";

export default function Messenger() {
  const { user, accessToken, loading } = useAuth();
  console.log("accessToken", accessToken);

  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);

  useEffect(() => {
    async function getConversations() {
      try {
        const res = await fetch("/api/messages/getConversationList", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);

        setConversations(data);
      } catch (error) {
        console.log(error);
      }
    }

    getConversations();
  }, [accessToken]);

  return (
    <div className="messenger">
      {loading && <Loader />}
      <div className="chat-list">
        {conversations.map((conversation: any) => (
          <button className="chat-item" key={conversation.id} onClick={() => setActiveConversation(conversation.id)}>
            <div className="participants-name" key={conversation.id}>{conversation.participants[0].user.username}</div>
          </button>
        ))}
      </div>
      <div className="active-chat"></div>
    </div>
  );
}
