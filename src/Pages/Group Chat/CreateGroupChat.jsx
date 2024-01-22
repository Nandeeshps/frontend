import React, { useState } from 'react';
import { useSelector } from 'react-redux';

const CreateGroupChat = ({ onCreateChat }) => {
  const CurrentUser=useSelector(state=>state.currentUserReducer)

  const [groupName, setGroupName] = useState('');
  const [groupMembers, setGroupMembers] = useState(CurrentUser.result.email);
  const [admin, setAdmin] = useState(CurrentUser.result.email);
  const [createdGroup, setCreatedGroup] = useState(null);

  const createChat = async () => {
    if (!groupName || !groupMembers) {
      alert('Please fill in all fields');
      return;
    }
  

    const membersArray = groupMembers.split(',').map((member) => member.trim()).filter((email) => {
    // Use a regular expression to validate the email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  });

if (membersArray.length < 1) {
  alert('Check is entered members is an email or not if also Minimum 2 valid email addresses are required');
  return;
}

    // Call the provided onCreateChat function with the chat details
    const createdGroup = { groupName, groupMembers, admin, chatType: 'text' };
     try {
      const response = await fetch('https://youtubeclone1-yur4.onrender.com/api/checkUsers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ groupMembers: membersArray }),
      });

      const result = await response.json();

      if (result.allUsersExist) {
        // Continue with creating the chat
        onCreateChat(createdGroup);

        // Clear form fields and set the created group for display
        setGroupName('');
        setGroupMembers('');
        setAdmin(CurrentUser.result.email);
        setCreatedGroup(createdGroup);
      } else {
        // Some users do not exist
        alert(`The following users do not exist: ${result.nonExistingUsers}. Please sign up.`);
      }
    } catch (error) {
      console.error('Error creating chat:', error);
      alert('Error creating chat. Please try again.');
    }
  };

  return (
    <div className='create'>
      <label>
        Group Name:
        <input type="text" value={groupName} onChange={(e) => setGroupName(e.target.value)} />
      </label>
      <br />
      <label>
        Group Members:
        <input type="email" value={groupMembers} onChange={(e) => setGroupMembers(e.target.value)} />
      </label>
      <br />
      <label>
        Admin:
        <input type="text" value={admin} onChange={(e) => setAdmin(e.target.value)} />
      </label>
      <br />
      <button onClick={createChat}>Create Group</button>

      {/* Display created group details after creating the group */}
      {createdGroup && (
        <div>
          <strong>Created Group Name:</strong> {createdGroup.groupName}
        </div>
      )}
      {createdGroup && (
        <div>
          <strong>Created Group Members:</strong> {createdGroup.groupMembers}
        </div>
      )}
    </div>
  );
};

export default CreateGroupChat;

