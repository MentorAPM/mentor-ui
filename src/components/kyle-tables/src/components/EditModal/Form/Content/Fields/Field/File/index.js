import React from 'react';
import PropTypes from 'prop-types';

import { FileInput } from 'mentor-inputs';

export const FileField = ({ disabled, fieldId, onDeleteClick, rowId, uploadFile, value }) => {
	
	if (disabled && !value) {
		return (
			<p className="no-file">
				No File Uploaded
			</p>
		);
	}

	if (disabled) {
		return (
			<div className="file-input-container">
				<div className="file-display">
					<a href={value} download className="file-link">File</a>
				</div>
			</div>
		);
	}

	return (
		<div className="file-input-container">
			{ value &&
				<div className="file-display">
					<a href={value} download className="file-link">File</a>
					<p
						className="file-delete"
						onClick={() => onDeleteClick(rowId, fieldId)}
					>
						Delete File
					</p>
				</div>
			}
			<div className="file-input" style={{ width: !!value ? '75%' : '100%' }}>
				<FileInput
					label="Upload File"
					name={fieldId}
					onDrop={uploadFile}
				/>
			</div>
		</div>
	);
};

FileField.propTypes = {
	colId: PropTypes.string,
	onDeleteClick: PropTypes.func,
	rowId: PropTypes.string,
	uploadFile: PropTypes.func,
	value: PropTypes.string
};
