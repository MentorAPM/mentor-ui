import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { useInputState } from '../../hooks/index';

import '../../styles/index.less';

const FloatInput = ({ icon, validation, precision, ...props }) => {

	const validate = [ isFloat, validation ];

	const inputState = useInputState({ validate, parse, ...props });
	const inputClasses = classNames('mui-mi-input-field', props.className);

	function parse(value) {
		if (isNaN(value)) {
			//avoid passing NaN into input 
			return ''; 
		} else if (!isNaN(precision)) {
			return Number(parseFloat(value).toFixed(precision))
		} else {
			return parseFloat(value);
		}	
	}

	return (
		<div className={inputState.classes.inputGroup}>
			<span className={inputState.classes.addon}>
				{ !!icon
					? <i className={icon} />
					: <span className="text">0.1</span>
				}
			</span>
			<input
				placeholder="Enter decimal"
				{...props}
				{...inputState}
				className={inputClasses}
			/>
		</div>
	);
}


function isFloat(value) {
	if (value != 0 && !parseFloat(value)) return 'Please enter a decimal value';
}
export default FloatInput;

