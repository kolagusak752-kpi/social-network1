import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { socket } from "../App";
import { AlertCircle, Check, Clock, SendHorizonal, X } from "lucide-react";
import Loader from "../components/Loading/Loader";
import UseDebounce from "../hooks/UseDebounce";
import type { Conversation, Participant } from "../types/interfaces";

function MessageStatus({ status }: { status?: string }) {
  const s = status ?? "sent";
  if (s === "sending") return <Clock size={12} color="#999" />;
  if (s === "failed") return <AlertCircle size={12} color="#e53935" />;
  return <Check size={12} color="#4fc3f7" />;
}
export default function Messenger() {
  const { user, accessToken, loading } = useAuth();
  console.log("accessToken", accessToken);

  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [activeUsers, setActiveUsers] = useState<Participant[] | []>([])
  const [activeMessages, setActiveMessages] = useState<any[]>([]);
  const [inputText, setInputText] = useState<string>("");

  const [findInput, setFindInput] = useState("");
  const findText = UseDebounce(findInput, 500);
  const [findActive, setFindActive] = useState(false);
  const [findResult, setFindResult] = useState([]);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  useLayoutEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, [inputText]);

  useEffect(() => {
    function handleMessage(data: any) {
      if (data.savedMessage.conversationId !== activeConversation) return;
      setActiveMessages((prev: any) => {
        if (prev.some((m: any) => m.id === data.savedMessage.id)) return prev;
        return [...prev, data.savedMessage];
      });
    }
    socket.on("message:new", handleMessage);
    return () => {
      socket.off("message:new", handleMessage);
    };
  }, [activeConversation]);
  useEffect(() => {
    if (!activeConversation) return;
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
    getMessages();
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
        console.log(data);
        if (!res.ok) throw new Error(data.message);

        setConversations(data);
      } catch (error) {
        console.log(error);
      }
    }

    getConversations();
  }, [accessToken]);
  useEffect(() => {
    if (!findText) return;
    async function findUser() {
      try {
        const res = await fetch(
          `/api/users/findByUsername?username=${findText}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
          },
        );
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        setFindResult(data);
      } catch (error) {
        console.log(error);
      }
    }
    findUser();
  }, [findText]);

  return ( <>
     {loading && <Loader />}
    <div className="messenger">
      <div className="chat-list">
        {!findActive && (
          <button
            className="find-btn"
            onClick={() => setFindActive(!findActive)
            }
          >
            Знайти користувача
          </button>
        )}

        {!findActive &&
          conversations.map((conversation: any) => (
            <button
              className="chat-item"
              key={conversation.id}
              onClick={() => {
                console.log(conversation)
                setActiveConversation(conversation.id)
                setActiveUsers(conversation.participants)
              }}
            >
              <div className="participants-info" key={conversation.id}>
                <img src = {conversation.participants[0].user.avatar} className = "avatar"></img>
                {conversation.participants[0].user.username}
              </div>
            </button>
          ))}
        {findActive && (
          <>
            <div className="find-active">
              <input
                onChange={(e) => setFindInput(e.target.value)}
                type="text"
                placeholder="Ім'я користувача"
              />
              <button
                className="close-btn"
                onClick={() => {
                  setFindActive(!findActive);
                  setFindResult([]);
                  setFindInput("");
                }}
              >
                <X />
              </button>
            </div>
            {findResult.map((user: any) => (
              <button
                className="chat-item"
                key={user.id}
                onClick={async () =>
                  setActiveConversation(await findOrCreateConversation(user.id))
                }
              >
                <div className="participants-name">{user.username}</div>
              </button>
            ))}
          </>
        )}
      </div>
      {activeConversation && (
        <div className="active-chat">
          <div className = "active-user">
            <Link to = {`/profile/${activeUsers[0].user.id}`} className = "user-profile-link">
            <img src = {activeUsers[0].user.avatar} className = "avatar"></img>
            {activeUsers[0].user.username}
            </Link>
          </div>
          <div className="messages">
            {activeMessages.map((message: any) => {
              const isMine = message.senderId === user?.id;
              return (
                <div
                  key={message.tempId ?? message.id}
                  className={isMine ? "myMessage" : "oneMessage"}
                >
                  <span>{message.message}</span>
                  {isMine && <MessageStatus status={message.status} />}
                </div>
              );
            })}
          </div>
          <div className="inputMessage">
            <textarea
              id="inputTextarea"
              ref={textareaRef}
              rows={1}
              placeholder="Напишіть щось..."
              onChange={(e) => setInputText(e.target.value)}
              value={inputText}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSentMessage();
                }
              }}
            ></textarea>
            <button className="send-btn" onClick={handleSentMessage}>
              <SendHorizonal />
            </button>
          </div>
        </div>
      )}
    </div>
  </>);

  async function handleSentMessage() {
    if (!inputText.trim()) return;

    const tempId = crypto.randomUUID();
    const text = inputText;

    setActiveMessages((prev: any) => [
      ...prev,
      {
        id: tempId,
        tempId,
        message: text,
        conversationId: activeConversation,
        status: "sending",
        senderId: user?.id,
      },
    ]);
    setInputText("");

    socket.timeout(15000).emit(
      "message:send",
      {
        message: text,
        conversationId: activeConversation,
        tempId,
      },
      (err: any, ack: any) => {
        setActiveMessages((prev: any) =>
          prev.map((message: any) => {
            if (message.tempId !== tempId) return message;
            if (err) return { ...message, status: "failed" };
            return {
              ...ack.message,
              tempId,
              status: ack.ok ? "sent" : "failed",
            };
          }),
        );
      },
    );
  }

  async function findOrCreateConversation(userId: string) {
    try {
      const res = await fetch(
        `/api/messages/findOrCreateConversation/${userId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      const data = await res.json();

      if (!res.ok) throw new Error(data.message);
      setActiveMessages(data.messages || []);
      return data.id;
    } catch (error) {
      console.log(error);
    }
  }
}
