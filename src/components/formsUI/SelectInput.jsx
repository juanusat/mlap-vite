import './formsUI.css';
import React from 'react';

export default function SelectInput({ label, name, value, onChange, required = false, disabled = false, options = [], ...props }) {
	return (
		<div className="form-group">
			{label && <label htmlFor={name}>{label}</label>}
			<select
				id={name}
				name={name}
				value={value}
				onChange={onChange}
				required={required}
				disabled={disabled}
				{...props}
			>
				{options.map((option) => (
					<option key={option.value} value={option.value}>
						{option.label}
					</option>
				))}
			</select>
		</div>
	);
}
