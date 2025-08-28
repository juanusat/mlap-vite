import React from 'react';
// ...existing code...

export function InputField({ type = 'text', placeholder, ...props }) {
  return (
    <input
      className="mlap-input"
      type={type}
      placeholder={placeholder}
      {...props}
    />
  );
}

export function MainButton({ children, ...props }) {
  return (
    <button className="mlap-main-btn" {...props}>
      {children}
    </button>
  );
}

export function SecondaryButton({ children, ...props }) {
  return (
    <button className="mlap-secondary-btn" {...props}>
      {children}
    </button>
  );
}
