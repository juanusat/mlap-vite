import React from 'react';
import './MyList1.css';

export default function MyList1({ children }) {
  return (
    <div className="ui-docs-list gap-2 my-list-1">
      {children}
    </div>
  );
}
