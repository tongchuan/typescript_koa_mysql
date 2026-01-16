import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useStore } from '../../stores';

const Item = observer(({ item }) => {
  const { testStore } = useStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(item.name);
  const [editDescription, setEditDescription] = useState(item.description);

  const handleDelete = () => {
    testStore.deleteItem(item.id);
  };

  const startEditing = () => {
    setIsEditing(true);
    setEditName(item.name);
    setEditDescription(item.description);
  };

  const handleUpdate = () => {
    if (editName.trim() && editDescription.trim()) {
      testStore.updateItem(item.id, editName, editDescription);
      setIsEditing(false);
    }
  };

  const cancelEditing = () => {
    setIsEditing(false);
    setEditName(item.name);
    setEditDescription(item.description);
  };

  return (
    <div style={{ marginBottom: '10px', padding: '10px', border: '1px solid #ccc' }}>
      {isEditing ? (
        // Edit mode
        <div>
          <input
            type="text"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            style={{ marginRight: '10px', padding: '5px', marginBottom: '5px' }}
          />
          <input
            type="text"
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            style={{ marginRight: '10px', padding: '5px', marginBottom: '5px' }}
          />
          <button onClick={handleUpdate} style={{ marginRight: '5px' }}>Save</button>
          <button onClick={cancelEditing}>Cancel</button>
        </div>
      ) : (
        // Display mode
        <div>
          <strong>{item.name}</strong> - {item.description}
          <div style={{ marginTop: '5px' }}>
            <button 
              onClick={startEditing} 
              style={{ marginRight: '5px', backgroundColor: '#f0f0f0' }}
            >
              Edit
            </button>
            <button 
              onClick={handleDelete}
              style={{ backgroundColor: '#ffcccc' }}
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
});

export default Item;