import React, { Fragment, useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

export const Row = ({ index, style, tree }) => {
	const { childrenCount, descendants, expanded, level, title, subtitle } = tree[index];
	const [loading, setLoading] = useState(false);

	/*const onToggleChildVisibility = useCallback(() => {
		if (typeof children === 'function') {
			toggleC
	});*/

	let scaffold = new Array(level + 1).fill(null).map((val, index) => {
		const classes = classNames({
			'mui-line-block': true,
			'mui-line-half-horizontal-right mui-line-half-vertical-top': index === level,
			//'mui-line-half-vertical-top': descendants - 
			//'mui-line-full-vertical': true
		});

		return <div className={classes} />;
	});

	return (
		<div
			className="mui-node-row"
			style={style}
		>
			{ childrenCount > 0 && (
				<button
					className={classNames(
						expanded 
							? 'node-collapse-button'
							: 'node-expand-button'
					)}
					style={{ left: 22 + (44 * level) + 'px' }}
					type="button"
				>
					{ expanded
						? <i className="fas fa-minus" />
						: <i className="fas fa-plus" />
					}
				</button>
			)}
			{scaffold}
			<div className="mui-node-handler">
				<div className="node-handler">
					<i className="far fa-bars fa-lg" />
				</div>
			</div>
			<div className="mui-node-content">
				<div className="node-text-title">
					{title}
				</div>
				<div className="node-text-subtitle">
					{ typeof subtitle === 'function'
						? subtitle(node)
						: subtitle || ''
					}
				</div>
			</div>
		</div>
	);
};

Row.propTypes = {
	title: PropTypes.string,
	subtitle: PropTypes.oneOfType([PropTypes.string, PropTypes.func])
};
