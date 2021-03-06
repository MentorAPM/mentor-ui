import React, { useState, } from 'react';
import cn from 'classnames';
import PropTypes from 'prop-types';
import { useInputValidation } from './useInputValidation';
// a material ui style input attempt with validation
import './styles.less';

export const MuiInput = props => {
	const {
		label,
		customValidator,
		onChange,
		className,
		...inputProps
	} = props;

	const [errorMessage, checkForErrors] = useInputValidation(customValidator);
	const [isEmpty, setIsEmpty] = useState(inputProps.value);

	function handleOnChange(evt) {
		const inputRef = evt.target;
		// check if input is empty
		setIsEmpty(inputRef.value.length > 0);
		checkForErrors(inputRef);

		if (typeof onChange === 'function') {
			onChange(evt);
		}
	}

	const inputClass = cn(
		className,
		{
			'not-empty': isEmpty,
			'error': !!errorMessage,
			'required': inputProps.required
		}
	);

	return (
		<div className="apm-mui-input-group m-b">
			<input
				{...inputProps}
				data-testid={inputProps.name + '-input'}
				className={inputClass}
				onChange={handleOnChange}
			/>
			<span className="apm-mui-highlight" />
			<span className="apm-mui-bar" />
			<label>{label}</label>
			<span className="APM-error-text">
				<strong data-testid={inputProps.name + '-error'}>
					{errorMessage}
				</strong>
			</span>
		</div>
	);
};

MuiInput.propTypes = {
	className: PropTypes.string,
	customValidator: PropTypes.oneOfType([PropTypes.func, PropTypes.arrayOf(PropTypes.func)]),
	label: PropTypes.string,
	onChange: PropTypes.func,
};
