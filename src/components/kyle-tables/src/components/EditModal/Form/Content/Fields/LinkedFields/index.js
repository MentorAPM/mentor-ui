import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { Field } from '../Field';

export const LinkedFields = ({
	data,
	fields,
	onDeleteFileClick,
	onOptionMatch,
	selectedField,
	uploadFile,
	...props
}) => {
	// updates get fired only when all fields are valid and the user blurs from the
	// linked fields
	const [newData, setNewData] = useState(() => (
		fields.reduce((acc, field) => {
			acc[field.id] = data[field.id] !== undefined && data[field.id] !== null
				? data[field.id]
				: '';

			return acc;
		}, {})
	));
	const [errors, setErrors] = useState({});

	const onChange = (err, value, name) => {
		const data = Object.assign({}, newData, { [name]: value });
		const fieldIndex = fields.findIndex(field => field.id === name);

		for (let i = fieldIndex + 1; i < fields.length; i++) {
			data[fields[i].id] = '';
		}

		setNewData(data);
		setErrors(Object.assign({}, errors, { [name]: !!err }));
	}

	const onBlur = (err, value, name) => {
		if (Object.values(errors).includes(true)) return;

		//newData[name] = value;
		//props.onBlur(rowId, name, value);
	};

	return (
		<div className="linked-fields">
			{ fields.map((field, i, arr) => {
				const fieldClasses = classNames({
					'field': true,
					'field-highlighted': field.label === selectedField
				});

				let disabled = field.updateable === false;

				if (i > 0) {
					const prevVal = arr[i - 1].id;
					disabled = newData[prevVal] === '';
				}

				return (
					<div
						className={fieldClasses}
						key={'field' + field.id}
					>
						<label>{field.label}</label>
						{ field.updateable === false
							&& <span className="cannot-update">
								Field cannot be changed
							</span>
						}
						<Field
							{...field}
							disabled={disabled}
							fieldId={field.id}
							onBlur={onBlur}
							onChange={onChange}
							onDeleteFileClick={onDeleteFileClick}
							onOptionMatch={onOptionMatch}
							rowId={data.id}
							uploadFile={uploadFile}
							value={newData[field.id]}
						/>
					</div>
				);
			})}
		</div>
	);
}