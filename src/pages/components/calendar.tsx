import styles from '@/styles/calendar.module.css'
import dayjs from 'dayjs'
import React, { useEffect, useState } from 'react'
import weekday from 'dayjs/plugin/weekday'
import weekOfYear from 'dayjs/plugin/weekOfYear'
import utc from 'dayjs/plugin/utc'
import arraySupport from 'dayjs/plugin/arraySupport'

// Extending dayjs with required plugins
//@ts-ignore
dayjs.extend(weekday)
//@ts-ignore
dayjs.extend(weekOfYear)
//@ts-ignore
dayjs.extend(utc)
//@ts-ignore
dayjs.extend(arraySupport)

// Constants for weekdays, today's date, and initial year/month
const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Th', 'Fri', 'Sat', 'Sun']
const TODAY = dayjs().format('YYYY-MM-DD')
const INITIAL_YEAR = dayjs().format('YYYY')
const INITIAL_MONTH = dayjs().format('MM')

// Main Calendar component
export default function Calendar() {
  console.log('Calendar component rendered')
  // State variables for selected month and days of the month
  const [selectedMonth, setSelectedMonth] = useState(dayjs(new Date(+INITIAL_YEAR, +INITIAL_MONTH - 1, 1)))
  const [currentMonthDays, setCurrentMonthDays] = useState([])
  const [previousMonthDays, setPreviousMonthDays] = useState([])
  const [nextMonthDays, setNextMonthDays] = useState([])

  // Effect to initialize the calendar when the selectedMonth changes
  useEffect(() => {
    initCalendar();
  }, [selectedMonth])

  // Function to initialize the calendar
  function initCalendar() {
    //more console.logs
    console.log('Initializing calendar...')
    const year = selectedMonth.format('YYYY')
    const month = selectedMonth.format('M')

    const calendarDays = document.getElementById('calendar_days')
    document.getElementById('selected_month')!.innerText = selectedMonth.format('MMMM YYYY')

    removeAllDayElements(calendarDays)

    // Set the state for the current, previous, and next month days
    setCurrentMonthDays(createCurrentMonthDays(year, month))
    setPreviousMonthDays(createPreviousMonthDays(year, month))
    setNextMonthDays(createNextMonthDays(year, month))

    //Couple more console.logs
    console.log('Current month days:', currentMonthDays)
    console.log('Previous month days:', previousMonthDays)
    console.log('Next month days: ', nextMonthDays)
    
    // Initialize month selector event handlers
    initMonthSelectors()
  }

  // Function to append a day to the calendar
  function appendDay(day, calendarDays) {
    const elementDay = document.createElement('li')
    const elementDayClassList = elementDay.classList
    elementDayClassList.add('calendar_day')
    const dayOfMonthElement = document.createElement('span')
    dayOfMonthElement.innerText = day.dayOfMonth
    elementDay.appendChild(dayOfMonthElement)
    calendarDays.appendChild(elementDay)

    if (!day.isCurrentMonth) {
      elementDayClassList.add('not_current_day')
    }

    if (day.date === TODAY) {
      elementDayClassList.add('today_calendar_day');
    }
  }

  // Effect to initialize month selector event handlers and clean up
  useEffect(() => {
    return () => {
      document.getElementById('previous_month')?.removeEventListener('click', handlePreviousMonthClick);
      document.getElementById('current_month')?.removeEventListener('click', handleCurrentMonthClick);
      document.getElementById('next_month')?.removeEventListener('click', handleNextMonthClick);
    };
  }, []);

  // Event handler for clicking the previous month button
  function handlePreviousMonthClick() {
    setSelectedMonth((prevMonth) => dayjs(prevMonth).subtract(1, 'month'));
  }

  // Event handler for clicking the current month button
  function handleCurrentMonthClick() {
    setSelectedMonth(dayjs(new Date(+INITIAL_YEAR, +INITIAL_MONTH - 1, 1)));
  }

  // Event handler for clicking the next month button
  function handleNextMonthClick() {
    setSelectedMonth((prevMonth) => dayjs(prevMonth).add(1, 'month'));
  }

  // Function to initialize month selector event handlers
  function initMonthSelectors() {
    document.getElementById('previous_month')?.addEventListener('click', handlePreviousMonthClick);
    document.getElementById('current_month')?.addEventListener('click', handleCurrentMonthClick);
    document.getElementById('next_month')?.addEventListener('click', handleNextMonthClick);
  }

  // JSX structure for the Calendar component
  return (
    <>
      <div className= {styles.calendar}>
        <section className="calendar_month_header">
          <div id="selected_month" className="selected_month_header"></div>
          <section className="header_month_selectors">
            <span id="previous_month" onClick={handlePreviousMonthClick}>&lt;</span>
            <span id="current_month" onClick={handleCurrentMonthClick}></span>
            <span id="next_month" onClick={handleNextMonthClick}>&gt;</span>
          </section>
        </section>
        <ol id="days_of_week" className="day_of_week"></ol>
        <ol id="calendar_days" className="day_grid"></ol>
      </div>
    </>
  );
}

// Utility function to remove all day elements from the calendar
function removeAllDayElements(calendarDays) {
  let first = calendarDays.firstElementChild;

  while (first) {
    first.remove();
    first = calendarDays.firstElementChild;
  }
}

// Function to create an array of current month days
function createCurrentMonthDays(year, month) {
  const numberOfDaysInMonth = dayjs(`${year}-${month}-01`).daysInMonth();
  return Array.from({ length: numberOfDaysInMonth }, (_, index) => {
    const dayOfMonth = index + 1;
    return {
      date: dayjs(`${year}-${month}-${dayOfMonth}`).format('YYYY-MM-DD'),
      dayOfMonth,
      isCurrentMonth: true,
    };
  });
}

// Function to create an array of previous month days
function createPreviousMonthDays(year, month) {
  const firstDayOfTheMonthWeekday = dayjs(`${year}-${month}-01`).day();
  const previousMonth = dayjs(`${year}-${month}-01`).subtract(1, 'month');

  const visibleDaysOfPreviousMonth = firstDayOfTheMonthWeekday ? firstDayOfTheMonthWeekday - 1 : 6;
  const previousMonthFinalMonday = dayjs(`${year}-${month}-01`).subtract(visibleDaysOfPreviousMonth, 'day').date();

  return Array.from({ length: visibleDaysOfPreviousMonth }, (_, index) => {
    return {
      date: dayjs(`${previousMonth.year()}-${previousMonth.month() + 1}-${previousMonthFinalMonday + index}`).format('YYYY-MM-DD'),
      dayOfMonth: previousMonthFinalMonday + index,
      isCurrentMonth: false,
    };
  });
}

// Function to create an array of next month days
function createNextMonthDays(year, month) {
  const lastDayOfMonth = dayjs(`${year}-${month}-01`).endOf('month');
  const lastDayOfMonthWeekday = lastDayOfMonth.day();
  const nextMonth = dayjs(`${year}-${month}-01`).add(1, 'month');

  const visibleDaysOfNextMonth = lastDayOfMonthWeekday ? 7 - lastDayOfMonthWeekday : lastDayOfMonthWeekday;

  return Array.from({ length: visibleDaysOfNextMonth }, (_, index) => {
    return {
      date: dayjs(`${nextMonth.year()}-${nextMonth.month() + 1}-${index + 1}`).format('YYYY-MM-DD'),
      dayOfMonth: index + 1,
      isCurrentMonth: false,
    };
  });
}
