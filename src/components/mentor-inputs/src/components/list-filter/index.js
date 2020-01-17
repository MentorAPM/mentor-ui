import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { createPortal } from 'react-dom';
import fuzzy from 'fuzzy';
import onClickOutside from 'react-onclickoutside';
import classNames from 'classnames';

import { Spinner } from './components/Spinner';
import { ListFilterItem } from './components/ListFilterItem';
import KeyEvent from './keyEvents';

// keycodes to handle for matching against the list
const AUTOCOMPLETE_KEYS = {
	//[KeyEvent.DOM_VK_TAB]: true,
	[KeyEvent.DOM_VK_RETURN]: true,
	[KeyEvent.DOM_VK_ENTER]: true
};

// keycodes for going up and down the list
const NAVIGATION_KEYS = {
	[KeyEvent.DOM_VK_UP]: true,
	[KeyEvent.DOM_VK_DOWN] : true
};

// list filter takes a list of options and filters them as the user types
export class ListFilter extends Component {

	static propTypes = {
		autoFocus: PropTypes.bool,
		className: PropTypes.string,
		disabled: PropTypes.bool,
		listClasses: PropTypes.shape({
			container: PropTypes.string,
			item: PropTypes.string
		}),
		listStyle: PropTypes.shape({
			container: PropTypes.object,
			item: PropTypes.object
		}),
		name: PropTypes.string,
		onChange: PropTypes.func,
		onMatch: PropTypes.func,
		options: PropTypes.oneOfType([PropTypes.array, PropTypes.func]),
		parse: PropTypes.func,
		parseMatchedValue: PropTypes.func,
		required: PropTypes.bool,
		validation: PropTypes.func,
		value: PropTypes.any
	}

	static defaultProps = {
		autoFocus: false,
		className: '',
		disabled: false,
		listClasses: {},
		listStyle: {
			container: {},
			item: {}
		},
		name: '',
		onChange: null,
		onMatch: null,
		options: [],
		parse: null,
		parseMatchedValue: null,
		required: false,
		validation: null,
		value: ''
	}

	constructor(props) {
		super(props);

		const { options, parse, value } = this.props;
		const initValue = !!value && typeof parse === 'function' ? parse(value) : value;
		const initOptions = Array.isArray(options) && typeof parse === 'function'
			? options.map(val => parse(val))
			: options;

		this.lastMatchedVal = '';
		this.rawOptions = this.props.options;

		// @focused: true when the input box is focused; false otherwise
		// @hasError: true when the list filter has an error due to a 
		// 	mismatch or no value and it is required
		// @loadingFilter: true when loading in new options from a 
		// 	custom filter; false otherwise
		// @options: list of current options displayed to the user
		// @selectedOptionIndex: current option selected by the user
		// 	using the arrow keys
		// @value: current value in the input box
		this.state = {
			focused: !!this.props.autoFocus,
			hasError: false,
			loadingFilter: false,
			options: Array.isArray(options)
				? initOptions
				: [],
			selectedOptionIndex: -1,
			value: initValue
		};
	}

	componentDidMount() {
		const { name, onMatch, options, required } = this.props;
		const { value } = this.state;

		if (typeof options === 'function') {
			this.lastMatchedVal = value;
			this.customFilterMatches(value);

			return;
		}

		const newOptions = this.filterMatches(value, options);
		const hasError = this.checkForError(value, newOptions, required);

		if (!hasError) {
			this.lastMatchedVal = value;
		}

		this.setState({
			hasError,
			options: newOptions,
			value
		});
	}

	UNSAFE_componentWillReceiveProps(nextProps) {
		// if new value passed in, refilter list and check for error
		if (!!nextProps.value && this.state.value !== nextProps.value) {
			const { name, parse, required } = this.props;

			const value = !!nextProps.value && typeof parse === 'function'
				? parse(nextProps.value)
				: nextProps.value;

			if (this.state.value === value) return;

			if (typeof this.props.options === 'function') {
				this.lastMatchedVal = value;
				this.setState({ value }, () => {
					this.customFilterMatches(value);
				});

				return;
			}

			let options;

			// new list of options passed in with value
			if (nextProps.options.length > 0 && this.props.options !== nextProps.options) {
				options = this.filterMatches(value, nextProps.options)
				this.rawOptions = nextProps.options;
			} else {
				options = this.filterMatches(value, this.props.options);
			}

			const hasError = this.checkForError(value, options, required);

			if (!hasError) {
				this.lastMatchedVal = value;
			}

			this.setState({
				hasError,
				options,
				value
			});
		// new list of options were passed in
		} else if (this.props.options !== nextProps.options
				&& typeof this.props.options !== 'function') {
			const { required } = this.props;
			const { value } = this.state;

			const newOptions = this.filterMatches(value, nextProps.options);
			const hasError = this.checkForError(value, newOptions, required);
			this.rawOptions = nextProps.options;

			if (!hasError) {
				this.lastMatchedVal = value;
			}
			
			this.setState({
				hasError,
				options: newOptions
			});
		}
	}

	checkForError = (value, options = [], required) => {
		const { name, validation } = this.props;

		let hasError = !value && !!required;
		const validInput = options.find(option => typeof option === 'object'
			? option.title === value
			: option === value
		);

		if (!hasError && !!value && !validInput) {
			hasError = true;
		} else if (!hasError && typeof validation === 'function') {
			hasError = validation(value, name, options);
		}

		return hasError;
	}

	onFocus = (event) => {
		this.setState({
			focused: true
		}, () => {
			if (typeof this.props.onFocus === 'function') {
				this.props.onFocus(event);
			}
		});
	}

	handleClickOutside = () => {
		this.setState({
			focused: false,
			selectedOptionIndex: -1
		});
	}

	// return a list of filtered matches against user input
	// @value(string|object) - the users selected or typed option
	// @options([string]|[object]) - list of options to filter against
	// @return - returns the new list of options available
	// 	can be a list of strings or objects
	filterMatches = (value, options = []) => {
		const { parse } = this.props;
		let extract;

		if (typeof parse === 'function') {
			extract = parse;
		} else if (Array.isArray(this.props.options)
			&& this.props.options.length > 0
			&& typeof this.props.options[0] === 'object') {

			extract = el => el.title;
		}

		return fuzzy
			.filter(value, options, { extract })
			.map(option => (
				typeof option.original === 'object' && option.original.title && option.original.subtitle
					? option.original
					: option.string
			));
	}

	// @value(string): value to filter against
	// TODO need to fix firing a match on a custom filter; its breaking insert form linked fields
	customFilterMatches = (value) => {
		this.setState({
			loadingFilter: true,
			value
		}, () => {
			new Promise((resolve, reject) => {
				resolve(this.props.options(value));
			}).then(newOptions => {
				this.rawOptions = newOptions;

				if (typeof this.props.parse === 'function') {
					newOptions = newOptions.map(val => this.props.parse(val));
				}

				this.loadFilterOptions(value, newOptions);
			});
		});
	}

	loadFilterOptions = (value, newOptions) => {
		const { name, onChange, onMatch, required } = this.props;

		this.setState({
			hasError: this.checkForError(value, newOptions, required),
			loadingFilter: false,
			options: newOptions,
			selectedOptionIndex: -1,
			value
		}, () => {
			// fire onMatch if the value matches an option in the list
			if (typeof onMatch === 'function'
				&& !this.state.hasError
				&& value !== this.lastMatchedVal) {

				this.onMatch(value);

			} else if (typeof onChange === 'function') {
				onChange(this.state.hasError, value, name);
			}
		});
	}

	// if the user hits a valid keycode, fill out the input 
	// or move up and down the list
	onKeyDown = (event) => {
		if (!this.state.focused) {
			return;
		}

		// autofill from first option in the list if its available
		if (AUTOCOMPLETE_KEYS[event.keyCode]) {
			event.preventDefault();
			event.stopPropagation();
			this.autoCompleteKeyDown();
		// navigate highlighted option up or down
		} else if (NAVIGATION_KEYS[event.keyCode]) {
			event.stopPropagation();
			this.navigationKeyDown(event.keyCode);
		// escape closes options
		} else if (this.state.focused
			&& (event.keyCode === KeyEvent.DOM_VK_ESCAPE
				|| event.keyCode === KeyEvent.DOM_VK_TAB)) {

			this.setState({ focused: false });
		}
	}

	onKeyUp = (event) => {
		if (AUTOCOMPLETE_KEYS[event.keyCode]
			|| NAVIGATION_KEYS[event.keyCode]) {

			event.stopPropagation();
		}
	}

	// auto complete fires when enter is hit; will always be a valid input
	autoCompleteKeyDown = () => {
		const { onChange, onMatch, name } = this.props;
		const { options, selectedOptionIndex } = this.state;

		let option;

		// grab appropriate option from the list if it exists
		if (selectedOptionIndex > -1) {
			option = options[selectedOptionIndex];
		} else if (options.length > 0) {
			option = options[0];
		} else {
			// do nothing
			return;
		}

		if (typeof this.props.options === 'function') {
			this.setState({ value: option }, () => {
				this.customFilterMatches(option);
			});

			return;
		}

		this.setState({
			focused: false,
			hasError: false,
			options: this.filterMatches(option, this.props.options),
			selectedOptionIndex: -1,
			value: option
		}, () => {
			if (typeof onMatch === 'function' && this.lastMatchedVal !== option) {
				this.onMatch(option);
			}
		});
	}

	navigationKeyDown = (keyCode) => {
		const { options, selectedOptionIndex } = this.state;
		let newIndex;

		if (keyCode === KeyEvent.DOM_VK_DOWN) {
			newIndex = (selectedOptionIndex + 1) % options.length;
		} else {
			newIndex = selectedOptionIndex < 0
				? (options.length + selectedOptionIndex) % options.length
				: (options.length + selectedOptionIndex - 1) % options.length;
		}

		this.setState({ selectedOptionIndex: newIndex });
	}

	// handle a change in the input
	onChange = (event) => {
		const { name, onChange, onMatch, options, required } = this.props;
		const value = event.target.value;

		if (typeof options === 'function') {
			this.setState({ value }, () => {
				this.customFilterMatches(value);
			});

			return;
		}

		const newOptions = this.filterMatches(value, options);

		this.setState({
			hasError: this.checkForError(value, newOptions, required),
			options: newOptions,
			selectedOptionIndex: -1,
			value
		}, () => {
			// fire onMatch if the value matches an option in the list or
			// if there is no value and its not required
			if (typeof onMatch === 'function'
				&& !this.state.hasError
				&& this.lastMatchedVal !== value) {

				this.onMatch(value);

			// otherwise it was just a change event w/ no match
			} else if (typeof onChange === 'function') {
				onChange(this.state.hasError, value, name);
			}
		});
	}

	onMatch = (value) => {
		const { name, onMatch, options, parse, parseMatchedValue } = this.props;

		let matchedValue = typeof parse === 'function'
			? this.rawOptions.find(option => parse(option) === value)
			: value;

		if (typeof parseMatchedValue === 'function') {
			matchedValue = parseMatchedValue(matchedValue);
		}

		onMatch(matchedValue, name);
		this.lastMatchedVal = value;
	}

	clearInput = () => {
		this.onChange({ target: { value: '' } });
		this.inputRef.focus();
	}

	// handle a user clicking an option in the list with the mouse
	// @selectedOption(string|object) - the option the user clicked on
	onListItemClick = (selectedOption) => {
		const { name, onMatch, options } = this.props;

		if (typeof options === 'function') {
			this.setState({ value: selectedOption }, () => {
				this.customFilterMatches(selectedOption);
			});

			return;
		}

		this.setState({
			hasError: false,
			options: this.filterMatches(selectedOption, options),
			selectedOptionIndex: -1,
			value: selectedOption
		}, () => {
			if (typeof onMatch === 'function' && this.lastMatchedVal !== selectedOption) {
				this.onMatch(selectedOption);
			}
		});
	}

	onListItemMouseOver = (index) => {
		this.setState({ selectedOptionIndex: index });
	}

	renderIncrementalSearchResults = () => {
		if (!this.state.focused) {
			return null;
		}

		const { listClasses, listStyle, portalRef } = this.props;
		const { options, selectedOptionIndex } = this.state;

		const listContainerClasses = classNames(
			'mui-list-filter-menu-ul',
			{ [listClasses.container]: !!listClasses.container },
			'ignore-react-onclickoutside'
		);

		const listContainer = (
			<ul
				className={listContainerClasses}
				style={listStyle.container}
			>
				{ Array.isArray(options) && options.length > 0
					? options.map((option, i) => (
						<ListFilterItem
							index={i}
							key={i}
							listClasses={listClasses}
							onClick={this.onListItemClick}
							onMouseOver={this.onListItemMouseOver}
							option={option}
							selected={selectedOptionIndex === i}
							style={listStyle.item}
						/>
					))
					: null
				}
			</ul>
		);

		if (!!portalRef) {
			return createPortal(listContainer, portalRef);
		}

		return listContainer;
	}

	render() {
		const { 
			disabled,
			disableOnClickOutside,
			enableOnClickOutside,
			eventTypes,
			listClasses,
			listStyle,
			name,
			onMatch,
			options,
			outsideClickIgnoreClass,
			parse,
			parseMatchedValue,
			portalRef,
			preventDefault,
			required,
			stopPropagation,
			validation,
			...props
		} = this.props;
		const { hasError, loadingFilter, value } = this.state;

		const inputClasses = classNames({
			'mui-mi-input-field mui-mi-list-filter': true,
			[this.props.className]: !!this.props.className,
			'mui-mi-input-field-has-error': hasError
		});

		return (
			<div className="mui-mi-container">
				<input
					{...props}
					autoComplete="off"
					className={inputClasses}
					disabled={disabled}
					onChange={this.onChange}
					onFocus={this.onFocus}
					onKeyDown={this.onKeyDown}
					onKeyUp={this.onKeyUp}
					placeholder="Select an option"
					ref={ref => this.inputRef = ref}
					type="text"
					value={value}
				/>
				{ this.renderIncrementalSearchResults() }
				{ loadingFilter &&
					<span className="mui-mi-clear-input">
						<Spinner className="apm-color-black mui-loading-spinner" />
					</span>
				}
				{ !!value && !loadingFilter && !disabled &&
					<span
						className="mui-mi-clear-input"
						data-testid="clear-input"
						onClick={this.clearInput}
					>
						<i className="far fa-times" />
					</span>
				}
			</div>
		);
	}
}

export default onClickOutside(ListFilter);
