import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { socket } from "../App"; 
import {SendHorizonal} from "lucide-react"
import Loader from "../components/Loading/Loader";

export default function Messenger() {
  const { user, accessToken, loading } = useAuth();
  console.log("accessToken", accessToken);

  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [activeMessages, setActiveMessages] = useState<any[]>([]);
  const [inputText, setInputText] = useState<string>("")
  useEffect(()=> {
    function handleMessage(data:any) {
      if(data.savedMessage.conversationId === activeConversation) {
        setActiveMessages((prev:any) => [...prev, data.savedMessage])
      }
    }
      socket.on("message:new",handleMessage)
      return () => {
        socket.off("message:new",handleMessage)
      }
    },[activeConversation])
  useEffect(() => {
    async function getMessages() {
      try {
        const res = await fetch(`/api/messages/${activeConversation}/history`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        setActiveMessages(data);
      } catch (error) {
        console.log(error);
      }
    }
    getMessages()

  }, [activeConversation]);
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
        console.log(data)
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
          <button
            className="chat-item"
            key={conversation.id}
            onClick={() => setActiveConversation(conversation.id)}
          >
            <div className="participants-name" key={conversation.id}>
              {conversation.participants[0].user.username}
            </div>
          </button>
        ))}
      </div>
      {activeConversation && (
        <div className="active-chat">
          <div className = "messages">
            {activeMessages.map((message: any) => (
              <div className = "oneMessage">{message.message}</div>
            ))}
          </div>
          <div className="inputMessage">
            <textarea id = "inputTextarea"rows={1} placeholder="Напишіть щось..." onChange={(e) => setInputText(e.target.value)}>
            </textarea>
            <button className = "send-btn" onClick={() => {
              if(!inputText.trim()) return
              socket.emit("message:send", {message:inputText, conversationId:activeConversation})
            }}><SendHorizonal/></button>
          </div>
        </div>
      )}
    </div>
  );
}
