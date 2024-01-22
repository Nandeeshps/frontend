import React, { useState, useEffect } from 'react';
import { IoMdPersonAdd } from "react-icons/io";
import { IoSend } from "react-icons/io5";
import { useSelector } from 'react-redux';
import "../../Components/Navbar/Navbar.css";
import './GroupChat.css';

const GroupChats = ({ chatDetails }) => {
  const CurrentUser = useSelector(state => state.currentUserReducer);

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [memberName, setMemberName] = useState('');
  const [showAddMemberElements, setShowAddMemberElements] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch(`https://youtubeclone1-yur4.onrender.com/api/getMessages?groupName=${chatDetails.groupName}`);
        const data = await response.json();

        if (response.ok) {
          setMessages(data.messages);
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
  }, [chatDetails.groupName, CurrentUser, loaded]);

  const sendMessage = async () => {
    try {
      const response = await fetch('https://youtubeclone1-yur4.onrender.com/api/sendMessage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          groupName: chatDetails.groupName,
          sender: CurrentUser?.result.email,
          text: newMessage,
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
      const response = await fetch('https://youtubeclone1-yur4.onrender.com/api/addMember', {
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
    if (chatDetails.groupMembers.includes(CurrentUser?.result.email)) {
      setShowAddMemberElements((prev) => !prev);
    } else {
      alert('Only group members can add other members.');
    }
  };

  return (
    <>
      <div className='display'>
        <h2>{chatDetails.groupName}</h2>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <p>Admin: {chatDetails.admin}</p>
          {chatDetails.groupMembers.includes(CurrentUser?.result.email) && (
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
        <input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} />
        <button onClick={sendMessage}>
          <IoSend size={22} />
        </button>
      </div>
    </>
  );
};

export default GroupChats;
