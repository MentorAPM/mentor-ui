import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { TableRow } from './Row';
import './styles.less';

export class TableBody extends Component {

	static propTypes = {
		columns: PropTypes.arrayOf(PropTypes.object).isRequired,
		customColumns: PropTypes.object,
		expandable: PropTypes.bool,
		ExpandComponent: PropTypes.element,
		dragProperties: PropTypes.shape({
			draggable: PropTypes.oneOfType([
				PropTypes.bool,
				PropTypes.object,
			]),
			editDraggable: PropTypes.oneOfType([
				PropTypes.bool,
				PropTypes.object
			])
		}),
		rowButtons: PropTypes.arrayOf(PropTypes.object),
		rowData: PropTypes.arrayOf(PropTypes.object).isRequired,
		selectedRows: PropTypes.object,
	}

	static defaultProps = {
		columns: [],
		customClasses: {},
		dragProperties: {
			draggable: false,
			editDraggable: false
		},
		dropType: '',
		expandable: false,
		rowButtons: [],
		rowData: [],
		selectedRows: {}
	}

	constructor(props) {
		super(props);

		// @expandedRows: a hash map of all expanded rows
		// 	only used when the table body is expandable
		this.state = {
			expandedRows: {}
		};
	}

	// when a row is clicked, keep track if it needs to be expanded or not
	_onExpandClick = (rowId) => {
		const newExpandedRows = Object.assign({},
			this.state.expandedRows,
			{ [rowId]: !this.state.expandedRows[rowId] });

		this.setState({ expandedRows: newExpandedRows });
	}

	render() {
		const {
			allowSelection,
			columns,
			customClasses,
			customColumns,
			rowData,
			dragProperties,
			dropType,
			expandable,
			ExpandComponent,
			rowButtons,
			selectedRows,
			_onRowSelect,
		} = this.props;

		const { expandedRows } = this.state;

		let rows = [];

		rowData.forEach((row, i) => {
			rows.push(
				<TableRow
					allowSelection={allowSelection}
					columns={columns}
					customClasses={customClasses}
					customColumns={customColumns}
					draggable={dragProperties.draggable}
					dropType={dropType}
					expandable={expandable}
					expanded={expandedRows[row.id]}
					key={row.id}
					rowButtons={rowButtons}
					row={row}
					rowId={row.id}
					rowSelected={!!selectedRows[row.id]}
					selectedRows={selectedRows}
					_onExpandClick={this._onExpandClick}
					_onRowSelect={_onRowSelect}
				/>
			);

			// if rows are expandable and the row is expanded
			if (expandable && expandedRows[row.id]) {
				rows.push(
					<tr key={`${row.id}-expand-${i}`}>
						<td
							className="table-row-expanded"
							colSpan={rowButtons.length + 1}
						/>
						<td colSpan={allowSelection
							? columns.length + 1
							: columns.length
						}>
							{ React.cloneElement(
								ExpandComponent,
								{ row }
							)}
						</td>
					</tr>
				);
			}
		});

		const classList = classNames({
			'table-body': true,
			[customClasses.tableBody]: !!customClasses.tableBody
		});

		return (
			<tbody className={classList}>
				{rows}
			</tbody>
		);
	}
};
