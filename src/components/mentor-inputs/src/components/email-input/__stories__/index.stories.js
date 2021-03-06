import React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs, boolean, text, } from '@storybook/addon-knobs';
import { action } from 'storybook-utils';

import EmailInput from '../emailInput';


const actions = {
	onBlur: action('onBlur'),
	onChange: action('onChange')
};

storiesOf('Inputs/EmailInput', module)
	.addDecorator(withKnobs)
	.addWithJSX('general', () => {

		return (
			<EmailInput
				onBlur={actions.onBlur}
				onChange={actions.onChange}
				placeholder={text('placeholder', 'Enter an email address')}
				name="example-email-input1"
				value={text('overwrite value via props', '')}
				required={boolean('required', false)}
			/>
		);
	});



