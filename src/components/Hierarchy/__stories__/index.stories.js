import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from 'storybook-utils';

import Hierarchy from '../index';

const IMAGE = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA2ZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDpCNDY3QjdFRDY3MjA2ODExODcxRkE4RjQyQzM2RTYwRCIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDpCNTRGMEY1NTk3NkIxMUUxQjBEQkY2NUVCQzcyNzE0NCIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpCNTRGMEY1NDk3NkIxMUUxQjBEQkY2NUVCQzcyNzE0NCIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ1M1IE1hY2ludG9zaCI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjdFQTFBNjQ2QjQyMDY4MTE4NzFGQThGNDJDMzZFNjBEIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOkI0NjdCN0VENjcyMDY4MTE4NzFGQThGNDJDMzZFNjBEIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+3q/RKwAAAPpJREFUeNpi/P//PwMtAeOoBSRbYBM10wZIbQRiIRLNegHEoUB85MiydLggExaFE8gwHAQkgHgOuiA2C1Sg9F8sGFd4wsTVgZiTkAW4AEgtIxA/BeJoINYDYhMgvgMVhwE2ZE0sZAQFKJyPI/G/E3IVUYkBij8iGX4YGjS6eIKOKAsYkdR9RBLXJTZciQUdQOyDxHfAEQcMpMYBTPMjIL6MJH4BW6SS4wNY+E5DC+v/UCxHaRyANP8jIP+fkiBiwGcAActJimSyADYL/lJgHkjvL0IWHIHSzGgYF0CWP46es7HFQTrUFfZALEpkfLyDOix3tMocfBYABBgAAAJOxWsvzNoAAAAASUVORK5CYII=';

const tree = {
	expanded: true,
	id: '1',
	title: 'Root',
	subtitle: 'Root subtitle',
	data: { sample: 'data' },
	children: [
		{
			expanded: true,
			id: 'bar',
			title: 'Bar',
			subtitle: 'Bar subtitle',
			data: {},		
			children: [
				{
					expanded: false,
					id: 'Bar 1',
					title: 'Bar 1',
					subtitle: 'Bar 1 subtitle',
					data: {},
					children: []
				},
				{
					expanded: true,
					id: 'Bar 2',
					title: 'Bar 2',
					subtitle: 'Bar 2 subtitle',
					data: {},					
					children: [
					{
						expanded: true,
						id: 'Bar 2.1',
						title: 'Bar 2.1',
						data: {},
						children: [
						{
							id: 'Bar 2.1.0',
							title: 'Bar 2.1.0',
							children: [],
							expanded: false
						},
						{
							id: 'Bar 2.1.1',
							title: 'Bar 2.1.1',
							children: [],
							expanded: false
						}]
					}],
				},
				{
					id: 'Bar 3',
					title: 'Bar 3',
					children: [],
					expanded: false,
					children: []
				}
			],

		},
		{
			expanded: true,
			id: 'baz',
			title: 'Baz',
			subtitle: 'Baz Subtitle',
			data: {},			
			children: [{
				id: 'Baz 1',
				expanded: true,
				title: 'Baz 1',
				children: [{
					id: 'Baz 1.1',
					title: 'Baz 1.1',
					children: [],
					expanded: false
				}, {
					id: 'Baz 1.2',
					title: 'Baz 1.2',
					expanded: true,
					children: [{
						id: 'Baz 1.2.1',
						title: 'Baz 1.2.1',
						expanded: false,
						children: []
					}, {
						id: 'Baz 1.2.2',
						title: 'Baz 1.2.2',
						expanded: true,
						children: [{
							id: 'Baz 1.2.2.1',
							title: 'Baz 1.2.2.1',
							children: [],
							expanded: false
						}, {
							id: 'Baz 1.2.2.2',
							title: 'Baz 1.2.2.2',
							children: [],
							expanded: false
						}, {
							id: 'Baz 1.2.2.3',
							title: 'Baz 1.2.2.3',
							children: [],
							expanded: false
						}, {
							id: 'Baz 1.2.2.4',
							title: 'Baz 1.2.2.4',
							children: [],
							expanded: false
						}]
					}],
				}, {
					id: 'Baz 1.3',
					title: 'Baz 1.3',
					expanded: false,
					children: [],
				}], 
			}],

		}
	],

};

function onExpandNode(node) {
	const rand = Math.random();

	return [{
		expanded: false,
		id: 'expand1' + rand,
		title: 'expand1',
		children: []
	}, {
		expanded: false,
		id: 'expand2' + rand,
		title: 'expand2',
		children: []
	}];
}

const customHandle = null;
// function customHandle(node) {
// 	if (node.level === 1) {
// 		return <img src={IMAGE} />;
// 	}
// 
// 	return null;
// }

function onDrop() {

}
const customButtons = (node) => {
	if (node.id === '1') return [];

	return [
		<button
			disabled={node.level < 2}
			style={{
				background: 'none',
				border: '1px solid green',
				textAlign: 'left',
				width: '100%'
			}}
			type="button"
		>
			<i className="fal fa-acorn" /> First button
		</button>,
		<button
			style={{
				background: 'none',
				border: '1px solid green',
				textAlign: 'left',
				width: '100%'
			}}
			type="button"
		>
			<i className="fal fa-air-freshener" /> Second button
		</button>
	];
};

function onExpandNodeAsync(node) {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			resolve(onExpandNode(node));
		}, 1200);
	});
}

storiesOf('Hierarchy', module)
	.add('Tree with an expand function', () => {
		return (
			<div style={{ height: window.innerHeight + 'px' }}>
				<Hierarchy
					canDrag={false}
					customButtons={customButtons}
					customHandle={customHandle}
					onExpandNode={onExpandNode}
					dispatch={action('dispatch')}
					onNodeClick={action('onNodeClick')}
					isVirtualized={false}
					tree={tree}
				/>
			</div>
		);
	}).add('Tree without an expand function', () => {
		return (
			<div style={{ height: window.innerHeight + 'px' }}>
				<Hierarchy
					canDrag={false}
					customButtons={customButtons}
					customHandle={customHandle}
					nodeStyle={{ borderRight: '10px solid blue' }}
					onNodeClick={action('onNodeClick')}
					isVirtualized={false}
					tree={tree}
				/>
			</div>
		);
	})
	.add('Tree with an async node expansion', () => {
		return (
			<div style={{ height: window.innerHeight + 'px' }}>
				<Hierarchy
					canDrag={false}
					isVirtualized={true}
					onExpandNode={onExpandNodeAsync}
					tree={tree}
				/>
			</div>
		);
	}).add('Overwriting children counts for asynchronous expansion', () => {
		return (
			<div style={{ height: window.innerHeight + 'px' }}>
				<Hierarchy
					canDrag={false}
					onNodeClick={action('onNodeClick')}
					isVirtualized={true}
					tree={{
						childrenCount: 3,
						title: 'Overall',
						expanded: true,
						id: '1',
						children: [{
							childrenCount: 2,
							expanded: true,
							id: '1-1',
							title: 'Beaver Canyon',
							children: [{
								children: [],
								childrenCount: 5,
								expanded: false,
								title: 'Primary and Clarification',
								id: '1-1-1'
							}, {
								children: [],
								childrenCount: 1,
								expanded: false,
								title: 'Filtration',
								id: '1-1-2'
							}],
						}, {
							children: [],
							childrenCount: 0,
							expanded: false,
							id: '1-2',
							title: 'Distribution'
						}, {
							childrenCount: 2,
							expanded: true,
							id: '1-3',
							title: 'Neville Island',
							children: [{
								children: [],
								childrenCount: 2,
								expanded: false,
								id: '1-3-1',
								title: 'Solids Handling'
							}, {
								children: [],
								childrenCount: 1,
								expanded: false,
								id: '1-3-2',
								title: 'Support Equipment'
							}],
						}]
					}}
				/>
			</div>
		);
	});
