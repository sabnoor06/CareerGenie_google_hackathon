import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';


function SideNav() {
  const Navigate = useNavigate();
  const [activeItem, setActiveItem] = useState('overview');

  const navItems = [
    { id: 'overview', label: 'Overview', icon: '📊', onClick: () => Navigate('/Overview') },

    { id: 'GenAIs', label: 'GenAIs', icon: '🔗', onClick: () => Navigate('/GenAI') },
    { id: 'customers', label: 'Customers', icon: '👥', onClick: () => Navigate('/Customers') },
    
    { id: 'settings', label: 'Settings', icon: '⚙️', onClick: () => Navigate('/Settings') },
    { id: 'account', label: 'Account', icon: '👤', onClick: () => Navigate('/Accounts') },
  ];

  const handleItemClick = (itemId) => {
    setActiveItem(itemId);
  };

  return (
    <div >
      
       
    </div>
  );
}

export default SideNav;
