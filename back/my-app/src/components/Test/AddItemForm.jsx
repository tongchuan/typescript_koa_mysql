import React, { useState } from 'react';
import { useStore } from '../../stores';

const AddItemForm = () => {
  const { userStore } = useStore();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim() && description.trim()) {
      userStore.addItem(name, description);
      setName('');
      setDescription('');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
      <h3>Add New Item</h3>
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={{ marginRight: '10px', padding: '5px' }}
      />
      <input
        type="text"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        style={{ marginRight: '10px', padding: '5px' }}
      />
      <button type="submit">Add Item</button>
    </form>
  );
};

export default AddItemForm;