import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { Field, Label, Portal, Stepper } from './components/index';
import { keyEvent as KeyEvent } from 'utils';
import { getInputComponent } from './utils/getInputComponent';

import './styles/form.less';


// Insert form pops up a transparent background with a form that asks one
// question at a time based on the formFields inputted. Once an input is
// filled out, it jumps to the next input. It allows for navigation using the
// Enter, Tab, and arrow up and down keys.
export default class InsertForm extends Component {

	static propTypes = {
		formFields: PropTypes.arrayOf(PropTypes.shape({
			filter: PropTypes.func,
			id: PropTypes.string.isRequired,
			label: PropTypes.string.isRequired,
			multiline: PropTypes.bool,
			options: PropTypes.arrayOf(PropTypes.string),
			required: PropTypes.bool,
			type: PropTypes.string
		})).isRequired,
		initInsertData: PropTypes.object,
		onDisable: PropTypes.func,
		onSubmit: PropTypes.func,
		resetForm: PropTypes.bool
	}

	static defaultProps = {
		formFields: [],
		initInsertData: {},
		onDisable: null,
		onSubmit: null,
		resetForm: false
	}

	constructor(props) {
		super(props);

		// insertion data taken from the form
		this.insertData = {};

		// @currentInputLabel: the current input label viewable by the user
		// @fieldIndex: index of the current form field that is active
		// @fieldsWithError: keeps track of errors in each field,
		// 	true if there is an error; false otherwise
		// @formModel: describes how the form should display
		// @steps: list of objects where each object describes a step
		// 	in the stepper
		this.state = {
			currentInputLabel: '',
			fieldIndex: 0,
			fieldsWithError: {},
			formModel: [],
			steps: []
		};
	}

	componentDidMount() {
		const { formFields } = this.props;

		if (Array.isArray(formFields) && formFields.length > 0) {
			this.initializeInsertForm();
		}

		window.addEventListener('keydown', this.onKeyDown);
	}

	componentWillUnmount() {
		window.removeEventListener('keydown', this.onKeyDown);
	}

	onKeyDown = (event) => {
		if (event.keyCode === KeyEvent.DOM_VK_TAB) {
			const { fieldIndex, formModel } = this.state;
			event.preventDefault();
			event.stopPropagation();

			if (event.shiftKey) {
				this.handleGoingLeft();
			} else if (fieldIndex + 1 < formModel.length) {
				this.handleGoingRight();
			} else {
				this._onSubmit();
			}
		} else if (event.keyCode === KeyEvent.DOM_VK_ESCAPE) {
			this.onDisable();
		}
	}

	initializeInsertForm = () => {
		const { formFields } = this.props;

		this.insertData = {};
		const initInsertData = Object.assign({}, this.props.initInsertData);
		const newFormModel = [];
		const newFieldsWithError = {};
		const newSteps = [];

		let InputComponent = null;
		let MentorInput = null;
		let inputProps = {};

		// initialize insert data
		formFields.forEach(field => {
			inputProps = {
				autoFocus: true,
				className: 'form-input',
				key: field.id,
				name: field.id,
				onBlur: this._handleInputBlur,
				onChange: this._handleInputChange,
				onKeyDown: this.onKeyDown,
				onMatch: this._handleOptionMatch,
				required: field.required,
				value: ''
			};

			InputComponent = getInputComponent(field, inputProps);
			
			this.insertData[field.id] = '';	// initialize insert data

			if (field.required && !initInsertData[field.id]) {
				newFieldsWithError[field.id] = true;
			}

			newSteps.push({
				id: field.id,
				title: field.label,
				error: !!field.required && !initInsertData[field.id]
			});

			newFormModel.push(Object.assign({}, field, { InputComponent }));
		});

		// initial data passed in to load into the form
		Object.keys(initInsertData).forEach(key => {
			this.insertData[key] = initInsertData[key];
		});

		this.setState({
			currentInputLabel: formFields.length > 0
				? formFields[0].label
				: '',
			fieldIndex: 0,
			fieldsWithError: newFieldsWithError,
			formModel: newFormModel,
			steps: newSteps
		});
	}

	getField = () => {
		const { fieldIndex, formModel } = this.state;

		return formModel[fieldIndex];
	}

	// handle input after user changes an input form, add new
	// value to current insert data object
	// @error(bool) - true if the field has an error via validation; false 
	// 	otherwise
	// @newValue(string) - new value in the input box
	// @fieldId(string) - id of the form field that was updated
	_handleInputChange = (error, newValue, fieldId) => {
		this.insertData[fieldId] = newValue;
		this.handleFieldError(error, fieldId);
	}

	// handle input after user blurs an input form, add new
	// value to current insert data object
	// @error(bool) - true if the field has an error via validation; false 
	// 	otherwise
	// @newValue(string) - new value in the input box
	// @fieldId(string) - id of the form field that was updated
	_handleInputBlur = (error, newValue, fieldId) => {
		this.insertData[fieldId] = newValue;
		this.handleFieldError(error, fieldId);
	}

	// handle matches in list filter for options
	// @option(string|object) - option that was matched
	// @fieldId(string) - field to assign the match to
	_handleOptionMatch = (option, fieldId) => {
		this.insertData[fieldId] = option; 
		this.handleFieldError(false, fieldId);
	}

	handleFieldError = (error, fieldId) => {
		const { fieldIndex, fieldsWithError, steps } = this.state;
		const newFieldsWithError = Object.assign({}, fieldsWithError);
		const newSteps = steps.slice();

		if (error) {
			newFieldsWithError[fieldId] = true;
			newSteps[fieldIndex].error = true;
		// if old error is no longer valid, delete it
		} else if (newFieldsWithError[fieldId]) {
			delete newFieldsWithError[fieldId];
			newSteps[fieldIndex].error = false;
		}

		this.setState({
			fieldsWithError: newFieldsWithError,
			steps: newSteps
		});
	}

	// handle submitting insertion data to the backend
	_onSubmit = () => {
		if (Object.keys(this.state.fieldsWithError).length > 0) {
			return;
		}

		if (typeof this.props.onSubmit === 'function') {
			const data = Object.keys(this.insertData).reduce((acc, val) => {
				if (typeof this.insertData[val] === 'object'
					&& this.insertData[val].options) {

					acc[val] = this.insertData[val].options;
				} else {
					acc[val] = this.insertData[val];
				}

				return acc;
			}, {});

			this.props.onSubmit(data);
		}

		if (this.props.resetForm) {
			this.resetForm();
		}
	}

	// resets a form to original state
	resetForm() {
		const { initInsertData } = this.props;
		const { formModel } = this.state;
		const newIndex = 0;
		
		Object.keys(this.insertData).forEach(field => {
			this.insertData[field] = '';
		});

		Object.keys(initInsertData).forEach(field => {
			this.insertData[field] = initInsertData[field];
		});

		this.setState({
			fieldIndex: newIndex,
			currentInputLabel: formModel[newIndex].label
		});
	}

	// handles going right for fields to be inserted
	handleGoingRight = () => {
		const { fieldIndex, formModel } = this.state;

		// reached end of form
		if (fieldIndex + 1 > formModel.length) return;

		// else move forward in form
		if (fieldIndex + 1 < formModel.length) {
			const newIndex = fieldIndex + 1;

			this.setState({
				fieldIndex: newIndex,
				currentInputLabel: formModel[newIndex].label
			});
		}
	}

	// handles going left the fields to be inserted
	handleGoingLeft = () => {
		const { formModel, fieldIndex } = this.state;

		let newIndex = fieldIndex - 1;

		if (newIndex < 0) return;

		this.setState({
			currentInputLabel: formModel[newIndex].label,
			fieldIndex: newIndex
		});
	}

	onDisable = () => {
		if (typeof this.props.onDisable === 'function') {
			this.props.onDisable();
		}
	}

	onStepperClick = (index) => {
		const { formModel, fieldIndex } = this.state;

		if (fieldIndex === index) return;

		this.setState({
			currentInputLabel: formModel[index].label,
			fieldIndex: index
		});
	}

	render() {
		const { currentInputLabel, fieldIndex, fieldsWithError, formModel, steps } = this.state;

		if (formModel.length === 0) {
			return null;
		}

		const canGoLeft = (fieldIndex > 0);
		const canGoRight = ((fieldIndex + 1) < this.state.formModel.length);
		const fieldId = this.getField().id;

		return (
			<Portal>
				<div className="insert-popup-overlay">
					<div className="insert-popup-container">
						<div className="close-form">
							<i
								className="fa fa-2x fa-times apm-cursor-p apm-color-red"
								data-testid="disable-form"
								onClick={this.onDisable}
							/>
						</div>
						<div className="layout">
							<div className="form">
								<Label
									label={currentInputLabel}
									required={this.getField().required}
								/>
								<Field
									canGoLeft={canGoLeft}
									canGoRight={canGoRight}
									canSubmit={!canGoRight
										&& Object.keys(fieldsWithError).length === 0}
									handleGoingLeft={this.handleGoingLeft}
									handleGoingRight={this.handleGoingRight}
									InputComponent={this.getField().InputComponent}
									value={this.insertData[fieldId]}
									_onSubmit={this._onSubmit}

								/>
							</div>
							<div className="insert-popup-stepper">
								<Stepper 
									activeStep={fieldIndex}
									onClick={this.onStepperClick}
									steps={steps}
								/>
							</div>
						</div>
					</div>
				</div>
			</Portal>
		);
	}
}
