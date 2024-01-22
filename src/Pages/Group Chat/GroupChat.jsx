import React, { useState, useEffect } from 'react';
import GroupChats from './GroupChats.jsx';
import CreateGroupChat from './CreateGroupChat.jsx';
import './GroupChat.css'; // Import the CSS file for GroupChat (create if needed)
import LeftSidebar from '../../Components/LeftSidebar/LeftSidebar.jsx';
import { useSelector } from 'react-redux';
import { FaSearch } from 'react-icons/fa'; // Import the search icon

const GroupChat = () => {
  const CurrentUser = useSelector((state) => state.currentUserReducer);
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [isCreateChatVisible, setIsCreateChatVisible] = useState(false);
  const [messages, setMessages] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const handleSelectGroup = (groupDetails) => {
    setSelectedGroup(groupDetails);
  };

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const response = await fetch('https://youtubeclone1-yur4.onrender.com/api/chats');
        const chats = await response.json();
        setChats(chats);
      } catch (error) {
        console.error('Error fetching chats:', error);
      }
    };

    if (CurrentUser !== null) {
      // Fetch chats only if the user is logged in
      fetchChats();
    }

    return () => {
      console.log('Component unmounted'); // Add this line for debugging
    };
  }, [CurrentUser]);

  const createChat = async (chatDetails) => {
    try {
      const createdGroup = await createGroup(chatDetails);

      setChats((prevChats) => [...prevChats, createdGroup]);
      toggleCreateChat();

      const updatedChatResponse = await fetch(`https://youtubeclone1-yur4.onrender.com/api/chats/`);
      const updatedChat = await updatedChatResponse.json();

      const updatedChatIndex = chats.findIndex((chat) => chat._id === createdGroup._id);

      setChats((prevChats) => {
        const updatedChats = [...prevChats];
        updatedChats[updatedChatIndex] = updatedChat;
        return updatedChats;
      });
      console.log('New group chat created:', createdGroup);
    } catch (error) {
      console.error('Error creating chat:', error);
    }
  };

  const selectChat = async (chatIndex) => {
    if (selectedChat === chatIndex) {
      setSelectedChat(null);
    } else {
      setSelectedChat(chatIndex);

      // Fetch messages for the selected chat
      try {
        const response = await fetch('https://youtubeclone1-yur4.onrender.com/api/chats');
        const chats = await response.json();
        const selectedChatMessages = chats[chatIndex].messages;
        setMessages(selectedChatMessages);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    }
  };

  const toggleCreateChat = () => {
    setIsCreateChatVisible(!isCreateChatVisible);
  };

  const createGroup = async (chatDetails) => {
    try {
      const response = await fetch('https://youtubeclone1-yur4.onrender.com/api/createChat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(chatDetails),
      });

      const createdChat = await response.json();
      return createdChat;
    } catch (error) {
      console.error('Error creating chat:', error);
      throw error; // Propagate the error
    }
  };

  const handleSearch = () => {
    const filteredChats = chats.filter((chat) =>
      chat.groupName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setSearchResults(filteredChats);
  };

  const clearSearch = () => {
    setSearchTerm('');
    setSearchResults([]);
  };

  return (
    <div className="group-chat-container">
      <LeftSidebar />
      {CurrentUser !== null ? (
        <>
          <div className="chat-sidebar">
            <button onClick={toggleCreateChat} className="toggle-create-chat-button">
              {isCreateChatVisible ? 'Create Group Chat' : 'Create Group Chat'}
            </button>
            {isCreateChatVisible && <CreateGroupChat onCreateChat={createChat} />}
            <div className="search-container">
              <input
                type="text"
                placeholder="Search Groups"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button onClick={clearSearch}>X</button>
              <button onClick={handleSearch}>
                <FaSearch className='search-icon'/>
              </button>
            </div>
            {searchResults.length > 0 ? (
              <div className="chat-list">
                {searchResults.map((chat, index) => (
                  <div key={index} onClick={() => selectChat(index)} className="chat-item">
                    <strong>{chat.groupName}</strong>
                    {selectedChat === index && (
                      <>
                        <div style={{ overflowWrap: 'break-word' }}>
                          <strong>Admin:</strong> {chat.admin}
                        </div>
                        <div style={{ overflowWrap: 'break-word' }}>
                          <strong>Members:</strong>
                          <p> {chat.groupMembers + ','}</p>
                        </div>
                        <br />
                      </>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="chat-list">
                {chats.map((chat, index) => (
                  <div key={index} onClick={() => selectChat(index)} className="chat-item">
                    <strong>{chat.groupName}</strong>
                    {selectedChat === index && (
                      <>
                        <div style={{ overflowWrap: 'break-word' }}>
                          <strong>Admin:</strong> {chat.admin}
                        </div>
                        <div style={{ overflowWrap: 'break-word' }}>
                          <strong>Members:</strong>
                          <p> {chat.groupMembers + ','}</p>
                        </div>
                        <br />
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="chat-main">{selectedChat !== null && <GroupChats chatDetails={chats[selectedChat]} />}</div>
        </>
      ) : (
        <>
          <p>Please Login to access</p>
        </>
      )}
    </div>
  );
};

export default GroupChat;
