// components/WidgetsButton.tsx
import React, { useEffect } from 'react';
import Icons from '../../../assets/Icons/Icons';

interface WidgetsButtonProps {
  isWidgetMenuOpen: boolean;
  setIsWidgetMenuOpen: (isOpen: boolean) => void;
}



const WidgetsButton: React.FC<WidgetsButtonProps> = ({
  isWidgetMenuOpen,
  setIsWidgetMenuOpen
}) => {

  useEffect(() => {
    // Ask for notification permission
    if (Notification.permission !== 'granted') {
      Notification.requestPermission().then((permission) => {
        console.log('Notification permission:', permission);
      });
    }
  }, []);
  
  const showNotification = () => {
    if (Notification.permission === 'granted') {
      new Notification('Hello there!', {
        body: 'This is a simple push notification.',
        icon: 'https://via.placeholder.com/100', // optional
      });
    } else {
      alert('Please allow notifications first.');
    }
  };
  
  return (
    <div className="flex-shrink-0">
      <button
        onClick={() => setIsWidgetMenuOpen(!isWidgetMenuOpen)}
        className="flex items-center p-2 space-x-2 bg-white border border-gray-200 rounded-md shadow-sm hover:bg-gray-50"
      >
        <Icons variant="widgets" />
        <span className="font-light">Widgets</span>
      </button>
      <button onClick={showNotification}>Show Notification</button>
      
    </div>
  );
};

export default WidgetsButton;