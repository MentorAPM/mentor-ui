import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { TableHeaderCell } from './tableHeaderCell';
import { TableHeaderCheckboxCell } from './tableHeaderCheckboxCell';

const sortDescendingIcon = <i className="fas fa-sort-down" />;
const sortAscendingIcon = <i className="fas fa-sort-up" />;

export const TableHeaderRow = ({
	allowSelection,
	allRowsSelected,
	cells,
	customClasses,
	editMode,
	expandable,
	extraColumns,
	sort,
	_onRowSelectAll,
	_onSort
}) => {

	const headerRowClasses = classNames({
		[customClasses.tableHeaderRow]: !!customClasses.tableHeaderRow
	});

	// used if the table is expandable since the expand column is 
	// the last column
	const headerCellClasses = classNames({
		'table-heading-cell': true,
		[customClasses.tableHeaderCell]: !!customClasses.tableHeaderCell
	});

	return (
		<tr className={headerRowClasses}>
			{ expandable &&
				<th className="table-heading-cell table-expand-cell" /> }
			{ extraColumns.map((col, i) => (
				React.cloneElement(
					col.header,
					{ key: `table-extra-col-${i}` }
				)
			))}
			{ allowSelection && 
				<TableHeaderCheckboxCell
					allRowsSelected={allRowsSelected}
					editMode={editMode}
					_onRowSelectAll={_onRowSelectAll}
				/>
			}
			{ cells.map((cell, i) => (
				<TableHeaderCell
					customClasses={customClasses}
					id={cell.id}
					key={cell.category}
					onClick={_onSort}
					sorted={sort.id === cell.id}
					sortIcon={sort.ascending
						? sortAscendingIcon
						: sortDescendingIcon}
					title={cell.category}
				/>
			))}
		</tr>
	);
}

TableHeaderRow.propTypes = {
	allRowsSelected: PropTypes.bool,
	allowSelection: PropTypes.bool,
	cells: PropTypes.arrayOf(PropTypes.object).isRequired,
	customClasses: PropTypes.object,
	editMode: PropTypes.bool,
	expandable: PropTypes.bool,
	extraColumns: PropTypes.arrayOf(PropTypes.object),
	sort: PropTypes.shape({
		id: PropTypes.string,
		ascending: PropTypes.bool
	}),
	_onRowSelectAll: PropTypes.func,
	_onSort: PropTypes.func
};

TableHeaderRow.defaultProps = {
	cells: [],
	customClasses: {},
	extraColumns: [],
	sort: {}
};