/* eslint-disable react/display-name */

jest.mock('react-datepicker', () => {
	return (props) => <div>Datepicker: {JSON.stringify(props)}</div>;
});

import React from 'react';
import { TypeaheadComponent } from '../index';
import renderer from 'react-test-renderer';
import { cleanup, fireEvent, render, waitFor } from '@testing-library/react';

afterEach(cleanup);

const keyCodes = {
	BACKSPACE: 8,
	TAB: 9,
	RETURN: 13,
	ENTER: 14,
	ESCAPE: 27,
	UP: 38,
	DOWN: 40
};

describe('Rendering states of typeahead', () => {

	test('Default render', () => {
		const tree = renderer.create(<TypeaheadComponent />).toJSON();

		expect(tree).toMatchSnapshot();
	});

	test('Custom class render', () => {
		const tree = renderer.create(<TypeaheadComponent customClasses={{ input: 'foo' }} />).toJSON();

		expect(tree).toMatchSnapshot();
	});

	test('Label render', () => {
		const tree = renderer.create(<TypeaheadComponent label="foo" />).toJSON();

		expect(tree).toMatchSnapshot();
	});

	test('Operator label render', () => {
		const tree = renderer.create(<TypeaheadComponent operator="bar" />).toJSON();

		expect(tree).toMatchSnapshot();
	});
});

describe('Typeahead with a list of options', () => {

	test('List of string options', async () => {
		const { getByTestId, queryByText } = render(
			<TypeaheadComponent options={['foo', 'bar', 'baz']} />);

		fireEvent.focus(getByTestId('typeahead'));

		await waitFor(() => {
			expect(queryByText('foo')).toBeTruthy();
			expect(queryByText('bar')).toBeTruthy();
			expect(queryByText('baz')).toBeTruthy();
		});
	});

	test('Empty list of options', async () => {
		const { container } = await render(<TypeaheadComponent options={[]} />);

		fireEvent.focus(container.querySelector('input'));
		expect(container).toMatchSnapshot();
	});

	test('Datepicker datetime format', async () => {
		const { queryByText } = await render(<TypeaheadComponent datatype="datetime" />);

		expect(queryByText(/Datepicker:/)).toBeTruthy();
	});

	test('Datepicker date format', async () => {
		const { queryByText } = await render(<TypeaheadComponent datatype="date" />);

		expect(queryByText(/Datepicker:/)).toBeTruthy();
	});
});

describe('Sending new options to the typeahead', () => {
	test('New list of options passed down', async () => {
		const { getByTestId, getByText, queryByText, rerender } = await render(
			<TypeaheadComponent options={['a', 'b', 'c']} />
		);

		fireEvent.focus(getByTestId('typeahead'));
		expect(getByText('a')).toBeTruthy();

		await rerender(<TypeaheadComponent options={['d', 'e', 'f']} />);
		expect(queryByText('a')).toBeFalsy();
		expect(getByText('d')).toBeTruthy();
		expect(getByText('e')).toBeTruthy();
		expect(getByText('f')).toBeTruthy();
	});
});

describe('Updating the list of options as a user types', () => {

	test('Filtering a list of string options', async () => {
		const { container, getByTestId, queryByText } = render(
			<TypeaheadComponent options={['foo', 'bar', 'baz']} />);

		fireEvent.focus(getByTestId('typeahead'));
		fireEvent.change(getByTestId('typeahead'), { target: { value: 'b' } });

		await waitFor(() => {
			expect(queryByText('foo')).toBeFalsy();
			expect(queryByText('bar')).toBeInTheDocument();
			expect(queryByText('baz')).toBeInTheDocument();
			expect(container).toMatchSnapshot();
		});
	});
});

describe('Handling key events', () => {

	describe('Closing the menu with escape', () => {
		test('Escape keystroke', async () => {
			const { container, getByTestId, getByText } = render(
				<TypeaheadComponent options={['foo', 'bar', 'baz']} />);

			fireEvent.focus(getByTestId('typeahead'));

			await waitFor(async () => {
				expect(getByText('foo')).toBeInTheDocument();
				expect(getByText('bar')).toBeInTheDocument();
				expect(getByText('baz')).toBeInTheDocument();
			});
			fireEvent.keyDown(container.querySelector('input'), { keyCode: keyCodes.ESCAPE });
			await waitFor(() => {
				expect(container.querySelector('div.typeahead').children.length).toBe(1);
			});
		});
	});

	describe('Navigating up and down the menu', () => {
		test('Going down keystroke', async () => {
			const { container, getByTestId } = render(
				<TypeaheadComponent options={['foo', 'bar', 'baz']} />);

			fireEvent.click(getByTestId('typeahead'));
			await waitFor(() => getByTestId('typeahead'));
			fireEvent.keyDown(getByTestId('typeahead'), { keyCode: keyCodes.DOWN });

			await waitFor(() => {
				expect(container).toMatchSnapshot();
			});
		});

		test('Going up keystroke', async () => {
			const { container, getByTestId } = render(
				<TypeaheadComponent options={['foo', 'bar', 'baz']} />);

			fireEvent.focus(getByTestId('typeahead'));

			fireEvent.keyDown(getByTestId('typeahead'), { keyCode: keyCodes.UP });

			await waitFor(() => {
				expect(container).toMatchSnapshot();
			});
		});

		test('Going up/down keystroke with no options', async () => {
			const { container, getByTestId } = render(<TypeaheadComponent options={[]} />);

			fireEvent.click(getByTestId('typeahead'));

			fireEvent.keyDown(getByTestId('typeahead'), { keyCode: keyCodes.UP });

			await waitFor(() => {
				expect(container).toMatchSnapshot();
			});
		});
	});

	describe('Matching an option in the list', () => {
		test('Enter keystroke on default option', async () => {
			const addTokenForValue = jest.fn();
			const { getByTestId } = render(
				<TypeaheadComponent
					addTokenForValue={addTokenForValue}
					options={['foo', 'bar', 'baz']}
				/>
			);

			fireEvent.focus(getByTestId('typeahead'));

			fireEvent.keyDown(getByTestId('typeahead'), { keyCode: keyCodes.ENTER });

			await waitFor(() => {
				expect(addTokenForValue).toHaveBeenCalledWith('foo');
			});
		});

		test('Enter keystroke on a selected option', async () => {
			const addTokenForValue = jest.fn();
			const { getByTestId } = render(
				<TypeaheadComponent
					addTokenForValue={addTokenForValue}
					options={['foo', 'bar', 'baz']}
				/>
			);

			fireEvent.focus(getByTestId('typeahead'));

			fireEvent.keyDown(getByTestId('typeahead'), { keyCode: keyCodes.DOWN });
			fireEvent.keyDown(getByTestId('typeahead'), { keyCode: keyCodes.DOWN });
			fireEvent.keyDown(getByTestId('typeahead'), { keyCode: keyCodes.ENTER });

			await waitFor(() => {
				expect(addTokenForValue).toHaveBeenCalledWith('bar');
			});
		});

		test('Enter keystroke with no options', async () => {
			const addTokenForValue = jest.fn();
			const { getByTestId } = render(
				<TypeaheadComponent
					addTokenForValue={addTokenForValue}
					options={[]}
				/>
			);

			fireEvent.change(getByTestId('typeahead'), { target: { value: 'test' } });

			fireEvent.keyDown(getByTestId('typeahead'), { keyCode: keyCodes.ENTER });

			await waitFor(() => {
				expect(addTokenForValue).toHaveBeenCalledWith('test');
			});
		});

		test('Return keystroke on default option', async () => {
			const addTokenForValue = jest.fn();
			const { getByTestId } = render(
				<TypeaheadComponent
					addTokenForValue={addTokenForValue}
					options={['foo', 'bar', 'baz']}
				/>
			);

			fireEvent.focus(getByTestId('typeahead'));

			fireEvent.keyDown(getByTestId('typeahead'), { keyCode: keyCodes.RETURN });

			await waitFor(() => {
				expect(addTokenForValue).toHaveBeenCalledWith('foo');
			});
		});

		test('Enter keystroke on a selected option', async () => {
			const addTokenForValue = jest.fn();
			const { getByTestId } = render(
				<TypeaheadComponent
					addTokenForValue={addTokenForValue}
					options={['foo', 'bar', 'baz']}
				/>
			);

			fireEvent.focus(getByTestId('typeahead'));

			fireEvent.keyDown(getByTestId('typeahead'), { keyCode: keyCodes.DOWN });
			fireEvent.keyDown(getByTestId('typeahead'), { keyCode: keyCodes.DOWN });
			fireEvent.keyDown(getByTestId('typeahead'), { keyCode: keyCodes.RETURN });

			await waitFor(() => {
				expect(addTokenForValue).toHaveBeenCalledWith('bar');
			});
		});

		test('Return keystroke with no options', async () => {
			const addTokenForValue = jest.fn();
			const { getByTestId } = render(
				<TypeaheadComponent
					addTokenForValue={addTokenForValue}
					options={[]}
				/>
			);

			fireEvent.change(getByTestId('typeahead'), { target: { value: 'test' } });

			fireEvent.keyDown(getByTestId('typeahead'), { keyCode: keyCodes.RETURN });

			await waitFor(() => {
				expect(addTokenForValue).toHaveBeenCalledWith('test');
			});
		});
	});

	// this one breaks if i try to use react testing library for the keydown
	test('Keystroke that is not handled by an event handler', async () => {
		const onKeyDown = jest.fn();
		const instance = renderer.create(
			<TypeaheadComponent
				onKeyDown={onKeyDown}
				options={['foo', 'bar', 'baz']}
			/>
		).getInstance();

		instance.state.value = 'b';
		instance._onKeyDown({ keyCode: 98 });
		expect(onKeyDown).toHaveBeenCalledWith({ keyCode: 98 }, 'b');
	});
});

describe('On click outside -- 3rd party lib method', () => {

	test('Handle clicking outside input', () => {
		const instance = renderer.create(<TypeaheadComponent />).getInstance();

		instance.state.focused = true;
		instance.state.selectedOptionIndex = 5;
		instance.handleClickOutside();

		expect(instance.state.focused).toBe(false);
		expect(instance.state.selectedOptionIndex).toBe(-1);
	});
});
