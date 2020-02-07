import React, { Fragment, useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';

import { Portal } from './Portal';
import { Form } from './Form';
import { NextRecord } from './NextRecord';
import { PreviousRecord } from './PreviousRecord';

import './styles.less';

export const EditModal = ({
	closeEditMode,
	data,
	editMode,
	fields,
	getRowName,
	onBlur,
	onDeleteFileClick,
	onOptionMatch,
	portalNode,
	sections,
	uploadFile
}) => {

	if (!editMode || data.length === 0) return null;

	const [recordIndex, setRecordIndex] = useState(0);

	const onNextClick = useCallback(() => {
		if (recordIndex + 1 >= data.length) return;

		setRecordIndex(recordIndex + 1);
	});

	const onPreviousClick = useCallback(() => {
		if (recordIndex - 1 < 0) return;

		setRecordIndex(recordIndex - 1);
	});

	const hasPrevious = recordIndex > 0;
	const hasNext = recordIndex + 1 < data.length;

	return (
		<Portal 
			closeEditMode={closeEditMode}
			goToNextRecord={onNextClick}
			goToPreviousRecord={onPreviousClick}
			node={portalNode}
		>
			<PreviousRecord
				hasPrevious={hasPrevious}
				onPreviousClick={onPreviousClick}
			/>
			<Form
				closeEditMode={closeEditMode}
				currentIndex={recordIndex}
				data={data[recordIndex]}
				fields={fields}
				hasPrevious={hasPrevious}
				hasNext={hasNext}
				onBlur={onBlur}
				onDeleteFileClick={onDeleteFileClick}
				onNextClick={onNextClick}
				onOptionMatch={onOptionMatch}
				onPreviousClick={onPreviousClick}
				sections={sections}
				title={typeof getRowName === 'function'
					? getRowName(data[recordIndex])
					: data[recordIndex].id
				}
				totalRecords={data.length}
				uploadFile={uploadFile}
			/>
			<NextRecord
				hasNext={hasNext}
				onNextClick={onNextClick}
			/>
		</Portal>
	);
};

EditModal.propTypes = {
	data: PropTypes.arrayOf(PropTypes.object),
	editMode: PropTypes.bool,
	fields: PropTypes.arrayOf(PropTypes.object),
	getRowName: PropTypes.func,
	onBlur: PropTypes.func,
	onDeleteFileClick: PropTypes.func,
	onOptionMatch: PropTypes.func,
	uploadFile: PropTypes.func
};

EditModal.defaultProps = {
	data: [],
	fields: [],
};
