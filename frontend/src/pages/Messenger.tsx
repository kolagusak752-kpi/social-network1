import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { socket } from "../App";
import { SendHorizonal, X } from "lucide-react";
import Loader from "../components/Loading/Loader";
import UseDebounce from "../hooks/UseDebounce";

export default function Messenger() {
  const { user, accessToken, loading } = useAuth();
  console.log("accessToken", accessToken);

  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [activeMessages, setActiveMessages] = useState<any[]>([]);
  const [inputText, setInputText] = useState<string>("");

  const [findInput, setFindInput] = useState("");
  const findText = UseDebounce(findInput, 500);
  const [findActive, setFindActive] = useState(false);
  const [findResult, setFindResult] = useState([]);

  useEffect(() => {
    function handleMessage(data: any) {
      if (data.savedMessage.conversationId === activeConversation) {
        setActiveMessages((prev: any) => [...prev, data.savedMessage]);
      }
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

  return (
    <div className="messenger">
      {loading && <Loader />}
      <div className="chat-list">
        {!findActive && (
          <button
            className="find-btn"
            onClick={() => setFindActive(!findActive)}
          >
            Знайти користувача
          </button>
        )}

        {!findActive &&
          conversations.map((conversation: any) => (
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
          <div className="messages">
            {activeMessages.map((message: any) => {
              return <div className={message.senderId === user?.id ? "myMessage" : "oneMessage"}>{message.message}</div>;
            })}
          </div>
          <div className="inputMessage">
            <textarea
              id="inputTextarea"
              rows={1}
              placeholder="Напишіть щось..."
              onChange={(e) => setInputText(e.target.value)}
              value={inputText}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
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
  );

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

    socket.timeout(5000).emit(
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
