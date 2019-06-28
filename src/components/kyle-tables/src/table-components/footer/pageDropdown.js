import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';

import { IntegerInput } from 'mentor-inputs';

export const PageDropdown = ({ currentPage, onChange, pageSize, recordCount }) => {

	const maxPage = Math.ceil(recordCount / pageSize);

	// invalid page counts render nothing
	if (maxPage <= 0 || maxPage === Infinity) {
		return null;
	}

	const _onBlur = (err, value) => {
		if (err) return;

		if (typeof onChange === 'function') {
			onChange(value);
		}
	}

	return (
		<div className="page-dropdown">
			<IntegerInput
				className="page-dropdown-input"
				data-testid="pagedropdown"
				max={maxPage}
				min={1}
				name="page-dropdown"
				onBlur={_onBlur}
				value={currentPage}
			/>
			of {maxPage} pages
		</div>
	);

}

PageDropdown.propTypes = {
	currentPage: PropTypes.number,
	onChange: PropTypes.func,
	pageSize: PropTypes.number,
	recordCount: PropTypes.number
}

PageDropdown.defaultProps = {
	currentPage: 1,
	pageSize: 25,
	recordCount: 0
}
