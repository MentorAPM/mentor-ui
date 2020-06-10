import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import moment from 'moment';
import DatePicker from 'react-datepicker';

import {
	getDateFormat,
	getDateFormatForPicker,
	getPlaceholder,
	isValidDate,
	isValidDateOnInput
} from './utils/utils';

import 'react-datepicker/dist/react-datepicker.css';
import './styles.less';

const KeyEvent = { DOM_VK_TAB: 9 };

const SEC_IN_MIN = 60;
const MS_IN_SEC = 1000;

class DatePickerInput extends Component {

	static propTypes = {
		className: PropTypes.string,
		convertToLocal: PropTypes.bool,
		disabled: PropTypes.bool,
		error: PropTypes.bool,
		name: PropTypes.string,
		onBlur: PropTypes.func,
		onChange: PropTypes.func,
		required: PropTypes.bool,
		type: PropTypes.oneOf(['date', 'datetime']).isRequired,
		value: PropTypes.oneOfType([
			PropTypes.string,
			PropTypes.instanceOf(Date)
		])
	}

	static defaultProps = {
		className: '',
		convertToLocal: true,
		disabled: false,
		error: false,
		name: '',
		onBlur: null,
		onChange: null,
		required: false,
		type: 'datetime',
		value: ''
	}

	constructor(props) {
		super(props);

		const { convertToLocal, required, value } = this.props;

		const isValid = isValidDate(value, moment.ISO_8601);
		let initValue = null;

		if (isValid) {
			initValue = this.formatDate(value);
		}

		this.datePickerRef = React.createRef();

		// @hasError(bool) - if there is an error with the users selected date
		// @inputValue(string) - current value in the input field
		this.state = {
			hasError: !!required && !isValid,
			inputValue: initValue
		};
	}

	componentDidUpdate(prevProps) {
		// new date passed down
		if (this.props.value !== prevProps.value) {
			const isValid = isValidDate(this.props.value, moment.ISO_8601);
			let inputValue = null;

			if (isValid) {
				inputValue = this.formatDate(this.props.value);
			}

			this.setState({
				hasError: !!this.props.required && !isValid,
				inputValue
			});
		}
	}

	formatDate = (value) => {
		return this.props.convertToLocal
			? moment.utc(value).local().format()
			: moment.utc(value).format();
	}

	handleChange = (value, event) => {
		const { name, onDateChange, required, type } = this.props;
		let hasError = false;
		let inputValue = value;

		// change event indicates we are dealing with an event initiated by the user typing
		// into the input; otherwise it would be a click event which indicates the calendar 
		// was clicked and a valid date was selected by the user
		if (!!event && event.type === 'change') {
			inputValue = event.target.value;

			const isValid = isValidDateOnInput(moment(inputValue).format(getDateFormat(type)), type)
				&& isValidDate(inputValue, getDateFormat(type));

			hasError = (!!required && !inputValue) || (!!inputValue && !isValid);
		}

		this.setState({
			hasError,
			inputValue
		}, () => {
			if (typeof onDateChange === 'function') {
				onDateChange(this.state.hasError, this.state.inputValue, name);
			};
		});
	}

	// when blurring, if the input has an invalid date, the error and input need to 
	// be checked if they have to be cleared
	onBlur = (evt) => {
		const { name, onDateChange, required, type } = this.props;

		const inputValue = event.target.value;
		const isValid = isValidDateOnInput(moment(inputValue).format(getDateFormat(type)), type)
			&& isValidDate(inputValue, getDateFormat(type));

		const hasError = (!!required && !inputValue) || (!!inputValue && !isValid);

		if (!hasError) return;

		this.setState({
			hasError,
			inputValue
		}, () => {
			if (typeof onDateChange === 'function') {
				onDateChange(this.state.hasError, this.state.inputValue, name);
			};
		});
	}

	onKeyDown = (evt) => {
		if (evt.keyCode === KeyEvent.DOM_VK_TAB || evt.which === KeyEvent.DOM_VK_TAB) {
			this.datePickerRef.setOpen(false);
		}
	}

	render() {
		const { 
			className,
			convertToLocal,
			error,
			name,
			onBlur,
			onChange,
			required,
			type,
			value,
			...props
		} = this.props;
		const { hasError, inputValue } = this.state;

		const inputClasses = cn({
			'mui-mi-input-field': true,
			[this.props.className]: !!this.props.className,
			'mui-mi-input-field-has-error': hasError || error
		});

		let dateVal;

		if (!!inputValue) {
			dateVal = new Date(inputValue);

			// shift time by timezone offset to get utc if there is no local conversion
			if (!convertToLocal) {
				dateVal.setTime(dateVal.getTime() + dateVal.getTimezoneOffset() * SEC_IN_MIN * MS_IN_SEC);
			}
		}

		const popperClasses = cn(
			'mui-datepicker-popper',
			{ 'mui-datepicker-popper-datetime': type === 'datetime' }
		);

		return (
			<DatePicker
				className={inputClasses}
				dateFormat={getDateFormatForPicker(type)}
				dayClassName={() => 'mui-datepicker-day'}
				fixedHeight
				onBlur={this.onBlur}
				onChange={this.handleChange}
				onKeyDown={this.onKeyDown}
				openToDate={!hasError ? dateVal : undefined}
				placeholderText={getPlaceholder(type)}
				popperClassName={popperClasses}
				popperModifiers={{
					preventOverflow: {
						enabled: true,
						escapeWithReference: false,
						boundariesElement: 'viewport'
					}
				}}
				ref={ref => this.datePickerRef = ref}
				selected={!hasError ? dateVal : undefined}
				showTimeSelect={type === 'datetime'}
				timeIntervals={15}
				{...props}
			/>
		);
	}
}

export default DatePickerInput;
