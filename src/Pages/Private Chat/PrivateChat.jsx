import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { FaSearch } from 'react-icons/fa'; // Import the search icon
import Chat from './Chat';
import CreateChat from './CreateChat.jsx';
import '../../Pages/Group Chat/GroupChat.css';
import LeftSidebar from '../../Components/LeftSidebar/LeftSidebar.jsx';

const PrivateChat = () => {
  const CurrentUser = useSelector((state) => state.currentUserReducer);
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [isCreateChatVisible, setIsCreateChatVisible] = useState(false);
  const [messages, setMessages] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const handleSelectGroup = (groupDetails) => {
    setSelectedGroup(groupDetails);
  };

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const response = await fetch('https://youtubeclone1-yur4.onrender.com/api/privatechats');
        const chats = await response.json();

        const userGroups = chats.filter(chat => chat.groupMembers.includes(CurrentUser?.result.email));
        setChats(userGroups);
      } catch (error) {
        console.error('Error fetching chats:', error);
      }
    };

    if (CurrentUser !== null) {
      // Fetch chats only if the user is logged in
      fetchChats();
    }

    return () => {
      console.log('Component unmounted');
    };
  }, [CurrentUser]);

  const createChat = async (chatDetails) => {
    try {
      const createdGroup = await createGroup(chatDetails);

      setChats((prevChats) => [...prevChats, createdGroup]);
      toggleCreateChat();

      const updatedChatResponse = await fetch(`https://youtubeclone1-yur4.onrender.com/api/privatechats/`);
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

      try {
        const response = await fetch('https://youtubeclone1-yur4.onrender.com/api/privatechats');
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
      const response = await fetch('https://youtubeclone1-yur4.onrender.com/api/createPrivateChat', {
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
      throw error;
    }
  };

  const handleSearch = (query) => {
    const filteredChats = chats.filter((chat) =>
      chat.groupName.toLowerCase().includes(query.toLowerCase())
    );
    setSearchResults(filteredChats);
  };

  const clearSearch = () => {
    setSearchQuery('');
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
            {isCreateChatVisible && <CreateChat onCreateChat={createChat} />}
            <div className="search-container">
              <input
                type="text"
                placeholder="Search Groups..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  handleSearch(e.target.value);
                }}
              />
              {searchQuery && (
                <span className="clear-search" onClick={clearSearch}>
                  &#x2715;
                </span>
              )}
              <FaSearch className="search-icon" />
            </div>
            {selectedGroup && <Chat chatDetails={selectedGroup} />}
            <div className="chat-list">
              {searchQuery !== ''
                ? searchResults.map((chat, index) => (
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
                  ))
                : chats.map((chat, index) => (
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
          </div>
          <div className="chat-main">{selectedChat !== null && <Chat chatDetails={chats[selectedChat]} />}</div>
        </>
      ) : (
        <>
          <p>Please Login to access</p>
        </>
      )}
    </div>
  );
};

export default PrivateChat;
