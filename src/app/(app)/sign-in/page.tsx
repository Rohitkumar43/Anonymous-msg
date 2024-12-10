import React from 'react';

interface ButtonProps {
  label: string; // Text to display on the button
  onClick?: () => void; // Function to call on button click
  variant?: 'primary' | 'secondary'; // Button styles
  disabled?: boolean; // Disable button
}

const Button: React.FC<ButtonProps> = ({
  label,
  onClick,
  variant = 'primary',
  disabled = false,
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-6 py-2 rounded-md text-lg font-semibold shadow-md transition-transform transform hover:scale-105 
      ${
        variant === 'primary'
          ? 'bg-blue-500 text-white hover:bg-blue-600'
          : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
      }
      ${disabled && 'opacity-50 cursor-not-allowed'}
      `}
    >
      {label}
    </button>
  );
};

export default Button;
