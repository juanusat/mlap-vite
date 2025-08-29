import './formsUI.css';
import React from 'react';

export default function TextInput({ label, name, value, onChange, required = false, disabled = false, placeholder = '', ...props }) {
	return (
		<div className="form-group">
			{label && <label htmlFor={name}>{label}</label>}
			<input
				type="text"
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
