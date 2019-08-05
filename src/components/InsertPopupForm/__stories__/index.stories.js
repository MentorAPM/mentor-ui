import React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs, boolean, text } from '@storybook/addon-knobs';
import { action } from 'storybook-utils';
import { withInfo } from '@storybook/addon-info';

import InsertPopupForm from '../index';

storiesOf('InsertPopupForm', module)
	.addDecorator(withInfo)
	.addDecorator(withKnobs)
	.add('General', () => {
		
		return (
			<InsertPopupForm 
				formFields={[
					{ id: 'text', label: 'Text Input' },
					{ id: 'requiredText', label: 'Required Text Input', required: true },
					{ id: 'multiline', label: 'Multiline Text Input', multiline: true },
					{ id: 'options', label: 'Options', options: ['foo', 'bar'] },
				]}
				onDisable={action('onDisable')}
				onSubmit={action('onSubmit')}
			/>
		)
	})
	.add('Initial data', () => {
		return (
			<InsertPopupForm 
				formFields={[
					{ id: 'text', label: 'Text Input' },
					{ id: 'requiredText', label: 'Required Text Input', required: true },
					{ id: 'multiline', label: 'Multiline Text Input', multiline: true },
				]}
				initInsertData={{
					text: 'Initial',
					requiredText: 'Initial on required',
					extra: 'Not in form fields'
				}}
				onSubmit={action('onSubmit')}
			/>
		)
	})
	.add('Reset form', () => {
		return (
			<InsertPopupForm 
				formFields={[
					{ id: 'text', label: 'Text Input' },
					{ id: 'options', label: 'Options', options: ['foo', 'bar'] },
					{ id: 'multiline', label: 'Multiline Text Input', multiline: true },
				]}
				onSubmit={action('onSubmit')}
				resetForm={true}
			/>
		)
	})