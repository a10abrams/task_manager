import styles from '@/styles/Calendar.module.css';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';

// Import Day.js plugins
const weekday = require('dayjs/plugin/weekday');
const week_of_year = require('dayjs/plugin/weekOfYear');
const utc = require('dayjs/plugin/utc');
const array_support = require('dayjs/plugin/arraySupport');

// Extend Day.js with plugins
dayjs.extend(utc);
dayjs.extend(array_support);
dayjs.extend(weekday);
dayjs.extend(week_of_year);

// Constants
const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Th', 'Fri', 'Sat', 'Sun']
const TODAY = dayjs().format('YYYY-MM-DD')
const INITIAL_YEAR = dayjs().format('YYYY')
const INITIAL_MONTH = dayjs().format('MM')

export default function Calendar() {
  // State variables using useState hook
  const [selectedMonth, setSelectedMonth] = useState(dayjs(new Date(+INITIAL_YEAR, +INITIAL_MONTH - 1, 1)))
  const [currentMonthDays, setCurrentMonthDays] = useState([])
  const [previousMonthDays, setPreviousMonthDays] = useState([])
  const [nextMonthDays, setNextMonthDays] = useState([])

  // useEffect hook to initialize the calendar when selectedMonth changes
  useEffect(() => {
    initCalendar();
  }, [selectedMonth]);

  // initialize the calendar
  function initCalendar() {
    const year = selectedMonth.format('YYYY')
    const month = selectedMonth.format('M')

    // Access DOM elements
    const calendarDays = document.getElementById('calendar_days')
    document.getElementById('selected_month')!.innerText = selectedMonth.format('MMMM YYYY')

    // Remove all day elements from the calendar
    removeAllDayElements(calendarDays)

    // Update state variables with new month
    setCurrentMonthDays(createCurrentMonthDays(year, month))
    setPreviousMonthDays(createPreviousMonthDays(year, month))
    setNextMonthDays(createNextMonthDays(year, month))
  }

  // Add a day to the calendar
  function appendDay(day, calendarDays) {
    const elementDay = document.createElement('li')
    const elementDayClassList = elementDay.classList
    elementDayClassList.add('calendar_day')
    const dayOfMonthElement = document.createElement('span')
    dayOfMonthElement.innerText = day.dayOfMonth
    elementDay.appendChild(dayOfMonthElement)
    calendarDays.appendChild(elementDay)

    // Add CSS classes based on conditions
    if (!day.isCurrentMonth) {
      elementDayClassList.add('not_current_day');
    }

    if (day.date === TODAY) {
      elementDayClassList.add('today_calendar_day');
    }
  }

  // Initialize month selector event listeners
  function initMonthSelectors() {
    document.getElementById('previous_month')?.addEventListener('click', function () {
      setSelectedMonth((prevMonth) => dayjs(prevMonth).subtract(1, 'month'));
    });

    document.getElementById('current_month')?.addEventListener('click', function () {
      setSelectedMonth(dayjs(new Date(+INITIAL_YEAR, +INITIAL_MONTH - 1, 1)));
    });

    document.getElementById('next_month')?.addEventListener('click', function () {
      setSelectedMonth((prevMonth) => dayjs(prevMonth).add(1, 'month'));
    });
  }

  // useEffect hook to initialize month selectors and clean up event listeners
  useEffect(() => {
    initMonthSelectors();

    return () => {
      document.getElementById('previous_month')?.removeEventListener('click', handlePreviousMonthClick)
      document.getElementById('current_month')?.removeEventListener('click', handleCurrentMonthClick)
      document.getElementById('next_month')?.removeEventListener('click', handleNextMonthClick)
    };
  }, []);
  return (
    <>
      <div className = 'calendar'>
            <section className = 'calendar_month_header'>
                <div id = 'selected_month' className = 'selected_month_header'></div>
                <section className = 'header_month_selectors'>
                    <span id = 'previous_month'>&lt;</span>
                    <span id = 'current_month'></span>
                    <span id = 'next_month'>&gt;</span>
                </section>
            </section>
            <ol id = 'days_of_week' className = 'day_of_week'></ol>
            <ol id = 'calendar_days' className = 'day_grid'></ol>
        </div>
    </>
  );
}
