import './formsUI.css';
import React from 'react';

export default function TextInput({ label, name, value, onChange, required = false, disabled = false, placeholder = '', type = 'text', ...props }) {
	return (
		<div className="form-group">
			{label && <label htmlFor={name}>{label}</label>}
			<input
				type={type}
				id={name}
				name={name}
				value={value}
				onChange={onChange}
				required={required}
				disabled={disabled}
				placeholder={placeholder}
				{...props}
			/>
		</div>
	);
}
