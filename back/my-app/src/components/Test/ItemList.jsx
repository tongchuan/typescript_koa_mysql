import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useStore } from '../../stores';
import Item from './Item';

const ItemList = observer(() => {
  const { userStore } = useStore();

  return (
    <div>
      <h3>Items List</h3>
      {userStore?.items?.map((item) => (
        <Item key={item.id} item={item} />
      ))}
    </div>
  );
});

export default ItemList;