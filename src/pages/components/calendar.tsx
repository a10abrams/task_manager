import dayjs from "dayjs";
import React, { useCallback, useEffect, useRef, useState } from "react";
import weekday from "dayjs/plugin/weekday";
import weekOfYear from "dayjs/plugin/weekOfYear";
import utc from "dayjs/plugin/utc";
import arraySupport from "dayjs/plugin/arraySupport";
import EventsForm from "./eventsForm";
import { getEventsFromLocalStorage } from "../utilities/localStorageUtils";
import Day from "./Day";

// Extending dayjs with required plugins
//@ts-ignore
dayjs.extend(weekday);
//@ts-ignore
dayjs.extend(weekOfYear);
//@ts-ignore
dayjs.extend(utc);
//@ts-ignore
dayjs.extend(arraySupport);

// Constants for weekdays, today"s date, and initial year/month
const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const TODAY = dayjs().format("YYYY-MM-DD");
const INITIAL_YEAR = dayjs().format("YYYY");
const INITIAL_MONTH = dayjs().format("MM");

// Hoisted recently
const observancesData = [
  // New Year's Day
  { date: "2024-01-01", title: "New Year&apos;s Day", id : "newYears" },
  // Birthday of Dr. Martin Luther King, Jr
  { date: "2024-01-15", title: "Martin Luther King, Jr. Day", id : "mlkDay" },
  // Washington's Birthday
  { date: "2024-01-19", title: "Washington&apos;s Birthday", id : "washBirth" },
  // Valentine's Day
  { date: "2024-02-14", title: "Valentine&apos;s Day", id : "valDay" },
  // Earth Day
  { date: "2024-04-22", title: "Earth Day", id : "earthDay" },
  // Memorial Day
  { date: "2024-05-27", title: "Memorial Day", id : "memDay" },
  // Juneteenth
  { date: "2024-06-19", title: "Juneteenth", id : "june19"},
  // Independence Day
  {date: "2024-07-04", title: "Independence Day", id : "july4"},
  // Labor Day
  { date: "2024-09-02", title: "Labor Day", id : "labDay"},
  // Indigenous People's Day
  { date: "2024-10-14", title: "Indigenous People&apos;s Day", id : "secondMon"},
  // Veteran's Day
  { date: "2024-11-11", title: "Veteran&amp;s Day", id : "vetDay" },
  //Thanksgiving Day
  { date: "2024-11-28", title: "Thanksgiving Day", id : "thxDay"},
  //Halloween
  { date: "2024-10-31", title: "Halloween", id : "halloween"},
  // Christmas Day
  { date: "2024-12-25", title: "Christmas Day", id : "christmas"}
];

// Main Calendar component
const Calendar = () => {
  // State variables
  const [allEvents, setAllEvents] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(
    dayjs(new Date(+INITIAL_YEAR, +INITIAL_MONTH - 1, 1))
  );
  const [currentMonthDays, setCurrentMonthDays] = useState([]);
  const [previousMonthDays, setPreviousMonthDays] = useState([]);
  const [nextMonthDays, setNextMonthDays] = useState([]);

  // fix separating observances and userevents
  const [userEvents, setUserEvents] = useState([]);
  const [observances, setObservances] = useState([]);

  const [calendarUpdateCounter, setCalendarUpdateCounter] = useState(0);

  console.log("Calendar component rendered");

  // Ref for selected_month
  const selectedMonthRef = useRef(null);

  //Function to get all events for specific day; useCallback to fix re-rendering issue
  const getEventsForDay = useCallback((date) => {
    // Get user-created events
    const userEventsForDay = getUserEventsForDay(date);
  
    //Get observances for day
    const observancesForDay = getObservancesForDay(date);
  
    // Combine user events and observances
    return [...userEventsForDay, ...observancesForDay]
  }, []);

  // Event handlers
  function handlePreviousMonthClick() {
    setSelectedMonth((prevMonth) => dayjs(prevMonth).subtract(1, "month"));
  }

  function handleCurrentMonthClick() {
    setSelectedMonth(dayjs(new Date(+INITIAL_YEAR, +INITIAL_MONTH - 1, 1)));
  }

  function handleNextMonthClick() {
    setSelectedMonth((prevMonth) => dayjs(prevMonth).add(1, "month"));
  }

  // Function to update calendar
  const updateCalendar = () => {
    setCalendarUpdateCounter((prevCounter) => prevCounter + 1);
  }

  // Effect to update selected_month text when selectedMonth changes
  useEffect(() => {
    selectedMonthRef.current.innerText = selectedMonth.format("MMMM YYYY");
  }, [selectedMonth]);

  // Effect to initialize the calendar
  useEffect(() => {
    console.log("Initializing calendar...");
    const year = selectedMonth.format("YYYY");
    const month = selectedMonth.format("M");

    // Set the state for the current, previous, and next month days
    setCurrentMonthDays(createCurrentMonthDays(year, month, getEventsForDay));
    setPreviousMonthDays(createPreviousMonthDays(year, month));
    setNextMonthDays(createNextMonthDays(year, month));

    // separate user events and obervances data
    const userEventsData = getEventsFromLocalStorage();
    setUserEvents(userEventsData);
    setObservances(observancesData);

  }, [selectedMonth, calendarUpdateCounter, getEventsForDay]);

  // Effect to re-render the calendar when the state is updated
  useEffect(() => {
    console.log("Re-rendering calendar...");
  }, [currentMonthDays, previousMonthDays, nextMonthDays]);

  // Effect to fetch and update events from localStorage
  useEffect(() => {
    const storedEventsData = getEventsFromLocalStorage();
    setAllEvents(storedEventsData);
  }, []);

  // Function to get user events for a specific day
  const getUserEventsForDay = (date) => {
    // Filter events for the given date
    return userEvents.filter((event) => dayjs(event.date).isSame(date, "day"));
  }

  // Function to get observances for specific day
  const getObservancesForDay = (date) => {
    return observances.filter((observance) => dayjs(observance.data).isSame(date, "day"));
  }

  // Function to render the days of the month
  function renderDaysOfMonth() {
    const allYearDays = [...previousMonthDays, ...currentMonthDays, ...nextMonthDays];

    return allYearDays.map((day) => (
      <Day
        key={day.date}
        date={day.date}
        dayOfMonth={day.dayOfMonth}
        isCurrentMonth={day.isCurrentMonth}
        today={TODAY}
        events={getEventsForDay(day.date)}
        observancesData={observancesData}
        allYearDays={allYearDays}
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
            {renderDaysOfMonth()}
          </ol>
        </div>
      </div>
      <div id="form_container">
        <EventsForm updateCalendar={updateCalendar}/>
      </div>
    </>
  );

// Function to create an array of current month days -- updated to be dynamically rendered
function createCurrentMonthDays(year, month, getEventsForDay) {
  const numberOfDaysInMonth = dayjs(`${year}-${month}-01`).daysInMonth();

  return Array.from({ length: numberOfDaysInMonth }, (_, index) => {
    const dayOfMonth = index + 1;  // Ensure dayOfMonth is defined
    const date = dayjs(`${year}-${month}-${dayOfMonth}`).format("YYYY-MM-DD");

    return {
      date,
      dayOfMonth,
      isCurrentMonth: true,
      events: getEventsForDay(date),
    };
  });
}

// Function to create an array of previous month days
function createPreviousMonthDays(year, month) {
  const firstDayOfTheMonthWeekday = dayjs(`${year}-${month}-01`).day();
  const previousMonth = dayjs(`${year}-${month}-01`).subtract(1, "month");

  const visibleDaysOfPreviousMonth = firstDayOfTheMonthWeekday ? firstDayOfTheMonthWeekday - 1 : 6;
  const previousMonthFinalMonday = dayjs(`${year}-${month}-01`).subtract(visibleDaysOfPreviousMonth, "day").date();

  return Array.from({ length: visibleDaysOfPreviousMonth }, (_, index) => {
    return {
      date: dayjs(`${previousMonth.year()}-${previousMonth.month() + 1}-${previousMonthFinalMonday + index}`).format(
        "YYYY-MM-DD"
      ),
      dayOfMonth: previousMonthFinalMonday + index,
      isCurrentMonth: false,
    };
  });
}

// Function to create an array of next month days
function createNextMonthDays(year, month) {
  const lastDayOfMonth = dayjs(`${year}-${month}-01`).endOf("month");
  const lastDayOfMonthWeekday = lastDayOfMonth.day();
  const nextMonth = dayjs(`${year}-${month}-01`).add(1, "month");

  const visibleDaysOfNextMonth = lastDayOfMonthWeekday ? 7 - lastDayOfMonthWeekday : lastDayOfMonthWeekday;

  return Array.from({ length: visibleDaysOfNextMonth }, (_, index) => {
    return {
      date: dayjs(`${nextMonth.year()}-${nextMonth.month() + 1}-${index + 1}`).format("YYYY-MM-DD"),
      dayOfMonth: index + 1,
      isCurrentMonth: false,
    };
  });
}}

export default Calendar;
