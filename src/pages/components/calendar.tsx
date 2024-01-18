import dayjs from 'dayjs';
import React, { useEffect, useRef, useState } from 'react';
import weekday from 'dayjs/plugin/weekday';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import utc from 'dayjs/plugin/utc';
import arraySupport from 'dayjs/plugin/arraySupport';

// Extending dayjs with required plugins
//@ts-ignore
dayjs.extend(weekday);
//@ts-ignore
dayjs.extend(weekOfYear);
//@ts-ignore
dayjs.extend(utc);
//@ts-ignore
dayjs.extend(arraySupport);

// Constants for weekdays, today's date, and initial year/month
const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const TODAY = dayjs().format('YYYY-MM-DD');
const INITIAL_YEAR = dayjs().format('YYYY');
const INITIAL_MONTH = dayjs().format('MM');

// Sample events data -- changing it to top of file fixed ts2304
const eventsData = [
  { date: '2024-01-26', title: 'Birthday' },
  { date: '2024-01-31', title: 'Party' },
];

// Day component
const Day = ({ date, dayOfMonth, isCurrentMonth, today, events }) => {
  const dayClasses = `day_grid ${!isCurrentMonth ? 'not_current_day' : ''} ${
    date === today ? 'today_calendar_day' : ''
  }`;

  return (
    <li className={dayClasses} data-date={date}>
      <span>{dayOfMonth}</span>
      {events.map((event, eventIndex) => (
        <div key={eventIndex} className="event">
          {event.title}
        </div>
      ))}
    </li>
  );
};

// Main Calendar component
export default function Calendar() {
  console.log('Calendar component rendered');

  // Ref for selected_month; it holds a 'reference' to selected_month so that it can actually be accesible in the component; `useEffect` updates its content 
  const selectedMonthRef = useRef(null);

  // State variables for selected month and days of the month
  const [selectedMonth, setSelectedMonth] = useState(
    dayjs(new Date(+INITIAL_YEAR, +INITIAL_MONTH - 1, 1))
  );
  const [currentMonthDays, setCurrentMonthDays] = useState([]);
  const [previousMonthDays, setPreviousMonthDays] = useState([]);
  const [nextMonthDays, setNextMonthDays] = useState([]);

  // Effect to initialize the calendar when the selectedMonth changes
  useEffect(() => {
    initCalendar();
  }, [selectedMonth]);

  // Effect to log state after it has been updated
  useEffect(() => {
    console.log('Current month days:', currentMonthDays);
  }, [currentMonthDays]);

  useEffect(() => {
    console.log('Previous month days:', previousMonthDays);
  }, [previousMonthDays]);

  useEffect(() => {
    console.log('Next month days:', nextMonthDays);
  }, [nextMonthDays]);

  // Effect to update selected_month text when selectedMonth changes
  useEffect(() => {
    selectedMonthRef.current.innerText = selectedMonth.format('MMMM YYYY');
  }, [selectedMonth]);

  // Function to initialize the calendar
  function initCalendar() {
    console.log('Initializing calendar...');
    const year = selectedMonth.format('YYYY');
    const month = selectedMonth.format('M');

    // Set the state for the current, previous, and next month days
    setCurrentMonthDays(createCurrentMonthDays(year, month));
    setPreviousMonthDays(createPreviousMonthDays(year, month));
    setNextMonthDays(createNextMonthDays(year, month));
  }

  // Effect to re-render the calendar when the state is updated -- updated to use React components instead of manually manipulating DOM
  useEffect(() => {
    console.log('Re-rendering calendar...');
  }, [currentMonthDays, previousMonthDays, nextMonthDays]);

  // Function to update days
  function updateDays(calendarDays, days) {
    calendarDays.innerHTML = '';
    days.forEach((day) => {
      appendDay(day, calendarDays);
    });
  }

  // Function to append a day to the calendar
  function appendDay(day, calendarDays) {
    calendarDays.appendChild(
      <Day
        key={day.date}
        date={day.date}
        dayOfMonth={day.dayOfMonth}
        isCurrentMonth={day.isCurrentMonth}
        today={TODAY}
        events={getEventsForDay(day.date)}
      />
    );
  }

  function updateDay(existingDay, day) {
    const dayOfMonthElement = existingDay.querySelector('span');
    dayOfMonthElement.innerText = day.dayOfMonth;

    existingDay.querySelectorAll('.event').forEach((eventElement) => eventElement.remove());

    // Render events for day
    const eventsForDay = getEventsForDay(day.date);
    eventsForDay.forEach((event) => {
      const eventElement = document.createElement('div');
      eventElement.innerText = event.title;
      eventElement.classList.add('event');
      existingDay.appendChild(eventElement);
    });

    // Update CSS classes based on month + today
    const elementDayClassList = existingDay.classList;
    elementDayClassList.remove('not_current_day', 'today_calendar_day');

    if (!day.isCurrentMonth) {
      elementDayClassList.add('not_current_day');
    }

    if (day.date === TODAY) {
      elementDayClassList.add('today_calendar_day');
    }
  }

  function getEventsForDay(date) {
    // `filter` creates an array of all elements that pass the test in updateDay
    return eventsData.filter((event) => event.date === date);
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

  // Function to render the days of the month; should fix days sometimes not showing--double fixed for nextMonthDays
  function renderDaysOfMonth() {
    // day component
    const allYearDays = [...previousMonthDays, ...currentMonthDays, ...nextMonthDays];

    return allYearDays.map((day) => (
      <Day
        key={day.date}
        date={day.date}
        dayOfMonth={day.dayOfMonth}
        isCurrentMonth={day.isCurrentMonth}
        today={TODAY}
        events={getEventsForDay(day.date)}
      />
    ));
  }

  // JSX structure for the Calendar component
  return (
    <>
      <div className="calendar_container">
        <section className="calendar_month_header">
          <div id="selected_month" ref={selectedMonthRef} className="selected_month_header"></div>
          <section className="header_month_selectors">
            <div id="previous_month" onClick={handlePreviousMonthClick}>
              &lt;
            </div>
            <div id="current_month" onClick={handleCurrentMonthClick}></div>
            <div id="next_month" onClick={handleNextMonthClick}>
              &gt;
            </div>
          </section>
        </section>
        <div className="calendar_grid_container">
          <ol id="days_of_week" className="day_of_week">
            {/* This map function fixed the weekdays not showing up */}
            {WEEKDAYS.map((day) => (
              <li key={day}>{day}</li>
            ))}
          </ol>
          <ol id="calendar_days" className="day_grid">
            {/* This should fix the days not showing up sometimes */}
            {renderDaysOfMonth()}
          </ol>
        </div>
      </div>
    </>
  );
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
