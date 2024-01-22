import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { IoMdPersonAdd } from "react-icons/io";
import { IoSend } from "react-icons/io5";
import CryptoJS from 'crypto-js';
import "../../Components/Navbar/Navbar.css";
import '../../Pages/Group Chat/GroupChat.css';

const Chat = ({ chatDetails }) => {
  const CurrentUser = useSelector(state => state.currentUserReducer);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [memberName, setMemberName] = useState('');
  const [showAddMemberElements, setShowAddMemberElements] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch(`https://youtubeclone1-yur4.onrender.com/getMessage?groupName=${chatDetails.groupName}`);
        const data = await response.json();

        if (response.ok) {

          const decryptedMessages = data.messages.map((message) => {
            return {
              ...message,
              text: decryptMessage(message.text),
            };
          });

          setMessages(decryptedMessages);
          setLoaded(true);
        } else {
          console.error('Error fetching messages:', data.error);
        }
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    if (CurrentUser && !loaded) {
      fetchMessages();
    }
  }, [chatDetails.chatName, CurrentUser, loaded]);

  const encryptMessage = (text) => {
    // Encrypt messages before sending to the database
    return CryptoJS.AES.encrypt(text, 'Nandeesh@#17').toString();
  };

  const decryptMessage = (encryptedText) => {
    // Decrypt messages before displaying on the UI
    const bytes = CryptoJS.AES.decrypt(encryptedText, 'Nandeesh@#17');
    return bytes.toString(CryptoJS.enc.Utf8);
  };

  const sendMessage = async () => {
    try {
      const encryptedMessage = encryptMessage(newMessage);

      const response = await fetch('https://youtubeclone1-yur4.onrender.com/api/sendMessages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          groupName: chatDetails.groupName,
          sender: CurrentUser?.result.email,
          text: encryptedMessage,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Message sent successfully:', data);
        setMessages([...messages, { sender: CurrentUser?.result.email, text: newMessage, timestamp: new Date() }]);
        setNewMessage('');
      } else {
        alert('Error sending message:', data.error);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      alert('An error occurred. Please try again.');
    }
  };

  const addMember = async () => {
    try {
      const response = await fetch('https://youtubeclone1-yur4.onrender.com/api/addUser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          groupName: chatDetails.groupName,
          memberName,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Member added successfully:', data);
      
        const systemMessage = {
          sender: chatDetails.admin,
          text: `${memberName} is added by admin.`,
          timestamp: new Date(),
        };
  
        setMessages([...messages, systemMessage]);
        setMemberName('');
      
      } else {
        alert('User has not signed in', data.error);
      }
    } catch (error) {
      console.error('Error adding member:', error);
      alert('An error occurred. Please try again.');
    }
  };

  const toggleAddMemberElements = () => {
    if (CurrentUser?.result.email === chatDetails.admin) {
      setShowAddMemberElements((prev) => !prev);
    } else {
      alert('Only the admin can add members to the group.');
    }
  };

  return (
    <>
      <div  className="display">
        <h2>{chatDetails.groupName}</h2>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <p>Admin: <u>{chatDetails.admin}</u> </p>
          {CurrentUser?.result.email === chatDetails.admin && (
            <IoMdPersonAdd onClick={toggleAddMemberElements} />
          )}
        </div>
        {showAddMemberElements && (
          <>
            <div className="add-member" style={{ display: "flex", alignItems: "center", justifyContent: "end" }}>
              <input type="text" value={memberName} onChange={(e) => setMemberName(e.target.value)} />
              <button onClick={addMember}>
                <IoMdPersonAdd size={22} />
              </button>
            </div>
          </>
        )}
        <div className="message">
          {messages.map((message, index) => (
            <div key={index} style={{ width: "65vw" }}>
              <div className={message.sender !== CurrentUser?.result.email ? "otherblock" : "block"}>
                <div className={message.sender !== CurrentUser?.result.email ? "reverse" : "front"}>
                  <div className={message.sender === CurrentUser?.result.email ? 'my-message' : 'other-message'}>
                    {message.text}
                  </div>

                  <div className="Chanel_logo_App" style={{ margin: "0px 5px 0px 0px" }}>
                    <p className="fstChar_logo_App">
                      {message.sender === CurrentUser?.result.email ? (
                        <> {/* Use the current user's logo */}
                          {CurrentUser?.result.name ? (
                            <>{CurrentUser?.result.name.charAt(0).toUpperCase()}</>
                          ) : (
                            <>{CurrentUser?.result.email.charAt(0).toUpperCase()}</>
                          )}
                        </>
                      ) : (
                        <> {/* Use the sender's logo */}
                          {message.sender.charAt(0).toUpperCase()}
                        </>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="sending">
        <input type="text" placeholder='Type something...' value={newMessage} onChange={(e) => setNewMessage(e.target.value)} />
        <button onClick={sendMessage}>
          <IoSend size={22} />
        </button>
      </div>
    </>
  );
};

export default Chat;
