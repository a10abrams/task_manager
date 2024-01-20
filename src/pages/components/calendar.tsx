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

// Check if localStorage is available


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

// Hoisted in order to solve ts2304
function getEventsForDay(date) {
  // `filter` creates an array of all elements that pass the test in updateDay
  return eventsData.filter((event) => event.date === date);
}

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

  // check if localStorage is available
  const Calendar = () => {
    const localStorageAvailable = typeof window !== 'undefined' && window.localStorage;
  

  // Use localStorage, otherwise use fallback
  const storedEventsDataString = localStorageAvailable ? localStorage.getItem('eentsData') : null
  }

  // Ref for selected_month; it holds a 'reference' to selected_month so that it can actually be accesible in the component; `useEffect` updates its content 
  const selectedMonthRef = useRef(null);

  // State variables for selected month and days of the month
  const [selectedMonth, setSelectedMonth] = useState(
    dayjs(new Date(+INITIAL_YEAR, +INITIAL_MONTH - 1, 1))
  );
  const [currentMonthDays, setCurrentMonthDays] = useState([]);
  const [previousMonthDays, setPreviousMonthDays] = useState([]);
  const [nextMonthDays, setNextMonthDays] = useState([]);

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

  // Effect to initialize the calendar (instead of function)
  useEffect(() => {
    console.log('Initializing calendar...');
    const year = selectedMonth.format('YYYY');
    const month = selectedMonth.format('M');

    // Set the state for the current, previous, and next month days
    setCurrentMonthDays(createCurrentMonthDays(year, month));
    setPreviousMonthDays(createPreviousMonthDays(year, month));
    setNextMonthDays(createNextMonthDays(year, month));
  }, [selectedMonth])

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
  // fixed direct DOM manipulation -- update state based on logic instead
    const updatedCurrentMonthDays = currentMonthDays.map((currentDay) =>
      currentDay.date === day.date ? {...currentDay, events: getEventsForDay(day.date)} : currentDay
      );

    setCurrentMonthDays(updatedCurrentMonthDays);
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
  
  // Event handling logic

  const observancesData = [
    // New Year's Day
    { date: '2024-01-01', title: 'New Year&apos;s Day' },
    // Birthday of Dr. Martin Luther King, Jr
    { date: '2024-01-15', title: 'Martin Luther King, Jr. Day' },
    // Washington's Birthday
    { date: '2024-01-19', title: 'Washington&apos;s Birthday' },
    // Valentine's Day
    { date: '2024-02-14', title: 'Valentine&apos;s Day' },
    // Earth Day
    { date: '2024-04-22', title: 'Earth Day' },
    // Memorial Day
    { date: '2024-05-27', title: 'Memorial Day' },
    // Juneteenth
    { date: '2024-06-19', title: 'Juneteenth'},
    // Independence Day
    {date: '2024-07-04', title: 'Independence Day'},
    // Labor Day
    { date: '2024-09-02', title: 'Labor Day'},
    // Indigenous People's Day
    { date: '2024-10-14', title: 'Indigenous People&apos;s Day'},
    // Veteran's Day
    { date: '2024-11-11', title: 'Veteran&amp;s Day'},
    //Thanksgiving Day
    { date: '2024-11-28', title: 'Thanksgiving Day'},
    // Christmas Day
    { date: '2024-12-25', title: 'Christmas Day'}
  ]
  // Using local storage for data handling ; fix ts(2769) -- make sure storedEventsData is not null + parse the JSON string to convert it into an array
  const storedEventsDataString = localStorage.getItem('eventsData')
  const storedEventsData = storedEventsDataString ? JSON.parse(storedEventsDataString) : []

  const fullCalendarEventData = observancesData.concat(storedEventsData)

  const initEventsData = () => {
    //ensures if storedEventsData is falsy or empty, observancesData returns
    if(!storedEventsData || storedEventsData.length === 0) {
      return observancesData;
    } else {
      return fullCalendarEventData;
    }
  }

  const handleAddEvent = (newEvent) => {
    const updatedEventsData = [...fullCalendarEventData, newEvent]

    localStorage.setItem('eventsData', JSON.stringify(updatedEventsData));
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

// Function to create an array of current month days -- updated to be dynamically rendered
function createCurrentMonthDays(year, month) {
  const numberOfDaysInMonth = dayjs(`${year}-${month}-01`).daysInMonth();
  return Array.from({ length: numberOfDaysInMonth }, (_, index) => {
    const dayOfMonth = index + 1;
    const date = dayjs(`${year}-${month}-${dayOfMonth}`).format('YYYY-MM-DD');

    return {
      date,
      dayOfMonth,
      isCurrentMonth: true,
      events: getEventsForDay(date)
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
