import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';

import { Slider } from '../Slider';
import { composeClass } from 'utils';

import './style.less';


export const Time = (props) => {
    const {
		className,
		moment,
		minHour,
		maxHour,
		display,
		onChange,
    } = props;

	const changeHours = pos => {
		moment.hours(pos.x);
		onChange(moment);
	};

	const changeMinutes = pos => {
		moment.minutes(pos.x);
		onChange(moment);
	};

    const cc = composeClass('APMTime', className);

	return (
		<div className={cn(
			cc(),
			className,
			{ [cc('display')]: display },
		)}>
			<div className={cc('showtime')}>
				<span className={cc('time')}>
					{moment.format('HH')}
				</span>
				<span className={cc('separater')}>
					:
				</span>
				<span className={cc('time')}>
					{moment.format('mm')}
				</span>
			</div>
			<div className={cc('sliders')}>
				<div className={cc('time-text')}>
					Hours:
				</div>
				<Slider
					className="u-slider-time"
					xmin={minHour}
					xmax={maxHour}
					x={moment.hour()}
					onChange={changeHours}
				/>
				<div className={cc("time-text")}>
					Minutes:
				</div>
				<Slider
					className="u-slider-time"
					xmin={minHour}
					xmax={maxHour}
					x={moment.minute()}
					onChange={changeMinutes}
				/>
			</div>
		</div>
	);
};

Time.propTypes = {
	className: PropTypes.string,
	moment: PropTypes.object.isRequired,
	minHour: PropTypes.number,
	maxHour: PropTypes.number,
	display: PropTypes.boolean,
	onChange: PropTypes.func,
}