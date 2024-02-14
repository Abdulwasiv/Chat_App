import React, { useEffect, useState } from "react";
import ScrollToBottom from "react-scroll-to-bottom";
import './App.css'

function Chat({ socket, username, room }) {
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState([]);
  const [isTyping, setIsTyping] = useState(false);

  const sendMessage = async () => {
    if (currentMessage !== "") {
      const messageData = {
        room: room,
        author: username,
        message: currentMessage,
        time:
          new Date(Date.now()).getHours() +
          ":" +
          new Date(Date.now()).getMinutes(),
      };

      await socket.emit("send_message", messageData);
      setMessageList((list) => [...list, messageData]);
      setCurrentMessage("");
      setIsTyping(false);
    }
  };
  const handleTyping = () => {
    if (!isTyping) {
      setIsTyping(true);
      socket.emit("start_typing");
    }

   setTimeout(() => {
      setIsTyping(false);
      socket.emit("stop_typing");
    }, 3000);
  };

 useEffect(() => {
    const receiveMessageHandler = (data) => {
      setMessageList((list) => [...list, data]);
    };

    const receiveTypingHandler = (isTypingData) => {
      setIsTyping(isTypingData);
    };

    socket.on("receive_message", receiveMessageHandler);
    socket.on("receive_typing", receiveTypingHandler);

    return () => {
      socket.off("receive_message", receiveMessageHandler);
      socket.off("receive_typing", receiveTypingHandler);
    };
  }, [socket]);

  return (
    <div className="chat-window">
      <div className="chat-header"> 
      <p className="typing-indicator" >
        Chat_Room: {room}  {isTyping && `- someone is typing...`}
        </p>
      </div>
      <div className="chat-body">
        <ScrollToBottom className="message-container">
          {messageList.map((messageContent) => {
            return (
              <div
                className="message"
                id={username === messageContent.author ? "you" : "other"}
              >
                <div>
                  <div className="message-content">
                    <p>{messageContent.message}</p>
                  </div>
                  <div className="message-meta">
                    <p id="time">{messageContent.time}</p>
                    <p id="author">{messageContent.author}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </ScrollToBottom>
      </div>
      <div className="chat-footer">
        <input
          type="text"
          value={currentMessage}
          placeholder="Hey..."
          onChange={(event) => {
            setCurrentMessage(event.target.value);
            handleTyping(); // Trigger typing when input changes
          }}
          onKeyPress={(event) => event.key === "Enter" && sendMessage()}
        />
        <button onClick={sendMessage}>&#9658;</button>
      </div>
          </div>
  );
}

export default Chat;