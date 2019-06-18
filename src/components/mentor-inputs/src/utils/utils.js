import React from 'react';

import { BooleanInputComponent } from '../components/boolean-input/booleanInput';
import { DatePicker } from 'datepicker';
import EmailInput from '../components/email-input/emailInput';
import FileInput from '../components/file-input/fileInput';
import FloatInput from '../components/float-input/floatInput';
import IntegerInput from '../components/integer-input/integerInput';
import ListFilter from '../components/list-filter/index';
//import MaskedInput from '../components/masked-input/maskedInput';
import MoneyInput from '../components/money-input/moneyInput';
import SelectInput from '../components/select-input/selectInput';
import TextInput from '../components/text-input/textInput';
import TextareaInput from '../components/textarea-input/textareaInput';
import URLInput from '../components/url-input/urlInput';
import { AsyncDropdown } from '../components/async-dropdown/index';


// gets a mentor input based off the type passed in
// @type(string): type of mentor input to get
// @return(func): a react component function of the mentor input
export function getMentorInput(type = '') {

	switch (type) {
		case 'async-dropdown':
			return AsyncDropdown;
		case 'listfilter':
			return ListFilter;
		case 'boolean':
			return BooleanInputComponent;
		case 'integer':
			return IntegerInput;
		case 'file':
			return FileInput;
		case 'float':
			return FloatInput;
		case 'datetime':
		case 'date':
		case 'time':
			return DatePicker;	
		case 'email':
			return EmailInput;
		case 'select':
			return SelectInput;
		case 'textarea':
		case 'multiline':
			return TextareaInput;
		case 'money':
			return MoneyInput;
		//case 'maskedinput':
			//return MaskedInput;
		// case 'table':
		// 	return TableInput;
		case 'url':
			return URLInput;
		case 'string':
		case 'text':
		default:
			return TextInput;
	}
};