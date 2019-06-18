import moment from 'moment';
import React, { Component } from 'react';
import cx from 'classnames';
import { range, chunk } from 'lodash';

import { CalendarDay } from '../CalendarDay';

import './style.less';

const DAYS = [
	'Sun',
	'Mon',
	'Tue',
	'Wed',
	'Thu',
	'Fri',
	'Sat'
];

export function prevMonthShouldBeDisabled(currentMoment, minDate) {
	if (!minDate || moment(minDate).isAfter(currentMoment)) {
		return false;
	}

	const currentMomentCopy = moment(currentMoment);
	currentMomentCopy.subtract(1, 'month');
	currentMomentCopy.endOf('month');

	return currentMomentCopy.isBefore(minDate);
}

export function nextMonthShouldBeDisabled(currentMoment, maxDate) {
	if (!maxDate || moment(maxDate).isBefore(currentMoment)) {
		return false;
	}

	const currentMomentCopy = moment(currentMoment);
	currentMomentCopy.add(1, 'month');
	currentMomentCopy.startOf('month');

	return currentMomentCopy.isAfter(maxDate);
}

export class Calendar extends Component {

	constructor(props) {
		super(props);

		this.state = {
			currentTime: this.props.moment,
			prevMonthShouldBeDisabled: false,
			nextMonthShouldBeDisabled: false
		};
	}

	componentDidMount() {
		this.updateDisabledMonths();
	}

	selectDate = (i, w) => {
		const prevMonth = w === 0 && i > 7;
		const nextMonth = w >= 4 && i <= 14;
		const m = this.props.moment;

		if (prevMonth) m.subtract(1, 'month');
		if (nextMonth) m.add(1, 'month');

		m.date(i);

		this.props.onChange(m);
		this.updateDisabledMonths();
	};

	updateDisabledMonths = () => {
		const { minDate, maxDate } = this.props;
		const { currentTime } = this.state;

		this.setState({
			prevMonthShouldBeDisabled: prevMonthShouldBeDisabled(currentTime, minDate),
			nextMonthShouldBeDisabled: nextMonthShouldBeDisabled(currentTime, maxDate)
		});
	}

	prevMonth = e => {
		e.preventDefault();
		const momentCopy = this.props.moment;
		const { minDate } = this.props;

		momentCopy.subtract(1, 'month');

		if (momentCopy.isBefore(minDate, 'day')) {
			momentCopy.endOf('month');
		}

		this.updateDisabledMonths();
	}

	nextMonth = e => {
		e.preventDefault();
		const momentCopy = this.props.moment;
		const { maxDate } = this.props;

		momentCopy.add(1, 'month');

		if (momentCopy.isAfter(maxDate, 'day')) {
			momentCopy.startOf('month');
		}

		this.updateDisabledMonths();
	}

	render() {
		const { maxDate, minDate } = this.props;
		const {
			nextMonthShouldBeDisabled,
			prevMonthShouldBeDisabled
		} = this.state;
		const m = this.props.moment;
		const currentDate = m.date();
		const d1 = m.clone().subtract(1, 'month').endOf('month').date();
		const d2 = m.clone().date(1).day();
		const d3 = m.clone().endOf('month').date();
		const days = [].concat(
			range(d1 - d2 + 1, d1 + 1),
			range(1, d3 + 1),
			range(1, 42 - d3 - d2 + 1)
		);

		const prevMonthButtonClasses = cx({
			'prev-month': true,
			'prev-month-disabled': prevMonthShouldBeDisabled
		});
		const nextMonthButtonClasses = cx({
			'next-month': true,
			'next-month-disabled': nextMonthShouldBeDisabled
		});

		return (
			<div className={cx('m-calendar', this.props.className)}>
				<div className="toolbar">
					<button
						type="button"
						className={prevMonthButtonClasses}
						onClick={this.prevMonth}
						disabled={prevMonthShouldBeDisabled}
					>
						<i
							className="far fa-angle-left"
							style={{
								position: 'relative',
								bottom: '1px',
								right: '1px'
							}}
						/>
					</button>
					<span className="current-date">{m.format('MMMM YYYY')}</span>
					<button
						type="button"
						className={nextMonthButtonClasses}
						onClick={this.nextMonth}
						disabled={nextMonthShouldBeDisabled}
					>
						<i
							className="far fa-angle-right"
							style={{
								position: 'relative',
								bottom: '1px',
								left: '1px'
							}}
						/>
					</button>
				</div>
				<table>
					<thead>
						<tr>
							{ DAYS.map(d => (
								<td key={d}>{d}</td>
							))}
						</tr>
					</thead>
					<tbody>
						{ chunk(days, 7).map((row, week) =>
							<tr key={week}>
								{row.map(i =>
									<CalendarDay
										key={i}
										i={i}
										currentDate={currentDate}
										week={week}
										onClick={this.selectDate}
										currentMoment={m}
										minDate={minDate}
										maxDate={maxDate}
									/>
								)}
							</tr>
						)}
					</tbody>
				</table>
			</div>
		);
	}
}