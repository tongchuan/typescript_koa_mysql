import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { useStore } from '../stores';

const UserList: React.FC = observer(() => {
  const { userStore } = useStore();
  
  useEffect(() => {
    userStore.fetchUsers();
  }, []);
  
  if (userStore.isLoading) {
    return <div>Loading users...</div>;
  }
  
  if (userStore.error) {
    return <div className="error">{userStore.error}</div>;
  }
  
  return (
    <div className="user-list">
      <h3>Users ({userStore.users.length})</h3>
      <ul>
        {userStore.users.map(user => (
          <li key={user.id}>
            {user.name} - {user.email}
          </li>
        ))}
      </ul>
    </div>
  );
});

export default UserList;