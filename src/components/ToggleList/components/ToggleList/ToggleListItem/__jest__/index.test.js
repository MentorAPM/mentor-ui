/* eslint-disable */

jest.mock('react-spring/renderprops', () => {
	return {
		Spring: props => (
			<div>
				<div>{JSON.stringify(props)}</div>
				{props.children({})}
			</div>
		)
	};
});

/* eslint-enable */

import React from 'react';
import renderer from 'react-test-renderer';
import { cleanup, fireEvent, render } from '@testing-library/react';
import { ToggleListItem } from '../index';

afterEach(cleanup);

test('Default toggle list item', () => {
	const tree = renderer.create(<ToggleListItem content="Foo content" title="Foo" />).toJSON();

	expect(tree).toMatchSnapshot();
});

test('Expanded toggle list item', () => {
	const tree = renderer.create(<ToggleListItem content="Foo content" expanded={true} title="Foo" />).toJSON();

	expect(tree).toMatchSnapshot();
});

test('Opening content on a toggle list item', () => {
	const { getByText } = render(<ToggleListItem content="content" title="Foo" />);

	fireEvent.click(getByText('Foo'));
	expect(getByText('content')).toBeTruthy();
});

test('Toggle list item with custom class for the title', () => {
	const tree = renderer.create(
		<ToggleListItem content="content" customClasses={{ title: 'custom-class' }} title="Foo" />
	).toJSON();

	expect(tree).toMatchSnapshot();
});
