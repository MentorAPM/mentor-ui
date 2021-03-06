import React from 'react';
import renderer from 'react-test-renderer';
import { render, fireEvent, cleanup, } from '@testing-library/react';

import MoneyInput, { isMoney } from '../moneyInput';

afterEach(cleanup);

test('<MoneyInput /> with no props', () => {

	const component = renderer.create(<MoneyInput />);

	const tree = component.toJSON();
	expect(tree).toMatchSnapshot();
});

test('<MoneyInput /> required', () => {
	const component = renderer.create(<MoneyInput required={true} />);

	const tree = component.toJSON();
	expect(tree).toMatchSnapshot();
});

test('<MoneyInput /> with a custom className', () => {
	const component = renderer.create(<MoneyInput className="custom-class" />);

	const tree = component.toJSON();
	expect(tree).toMatchSnapshot();
});

test('<MoneyInput /> where props.value is pi', () => {
	const component = renderer.create(<MoneyInput value={Math.PI} />);

	const tree = component.toJSON();
	expect(tree).toMatchSnapshot();
});

test('<MoneyInput /> with proper money', () => {
	const component = renderer.create(<MoneyInput value="12.23" />);

	const tree = component.toJSON();
	expect(tree).toMatchSnapshot();
});

test('<MoneyInput /> corrects blurred value', () => {
	const { container } = render(<MoneyInput value="" />);

	// Change input to value to be corrected
	fireEvent.change(container.querySelector('input'), { target: { value: '12.5' } });

	// Blur Input
	fireEvent.blur(container.querySelector('input'));

	expect(container.querySelector('input').value).toEqual('12.50');
});

describe('Money validation function', () => {

	test('Integer is a valid money value', () => {
		expect(isMoney('11')).toBe(true);
	});

	test('Float with precision of 2 is a valid money value', () => {
		expect(isMoney('11.25')).toBe(true);
	});

	test('Float with decimal an invalid money value', () => {
		expect(isMoney('11.')).toBe('Invalid money value');
	});

	test('Float with precision of 1 is an valid money value', () => {
		// Precision of 1 is allowed because it gets corrected on blur of the input
		expect(isMoney('11.5')).toBe(true);
	});

	test('Invalid money on alphabetic values', () => {
		expect(isMoney('abc')).toBe('Invalid money value');
	});
});
