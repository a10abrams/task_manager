import styles from '@/styles/Calendar.module.css'
import dayjs from 'dayjs'
import React, { useEffect } from 'react'

/*CONSTANTS*/
const weekday = require('dayjs/plugin/weekday')
const week_of_year = require('dayjs/plugin/weekOfYear')
const utc = require('dayjs/plugin/utc')
const array_support = require('dayjs/plugin/arraySupport')

dayjs.extend(utc)
dayjs.extend(array_support)
dayjs.extend(weekday)
dayjs.extend(week_of_year)

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Th', 'Fri', 'Sat', 'Sun']
const TODAY = dayjs().format('YYYY-MM-DD')
const INITIAL_YEAR = dayjs().format('YYYY')
const INITIAL_MONTH = dayjs().format('MM')
const daysOfWeek = document.getElementById('days_of_week')

/*mutables*/
let selectedMonth = dayjs(new Date(+INITIAL_YEAR, +INITIAL_MONTH - 1, 1))
/*the above expression gave type error; the (+) coerces the type from string to int*/ 
let currentMonthDays;
let previousMonthDays;
let nextMonthDays;

WEEKDAYS.forEach((weekday) => {
    const weekDay = document.createElement('li')
    /*this expression gave a possibly null error that was overridden with the non-null assertion operator (!) */
    daysOfWeek!.appendChild(weekDay)
    weekDay.innerText = weekday
})

/* functions */
createCalendar()
initMonthSelectors()

function createCalendar(year = INITIAL_YEAR, month = INITIAL_MONTH) {
    const calendarDays = document.getElementById('calendar_days')
    
    document.getElementById('selected_month')!.innerText = dayjs(new Date(+year, +month-1)).format('MMMM YYYY')

    removeAllDayElements(calendarDays)

    currentMonthDays = createCurrentMonthDays(
        /*I'm hoping putting year and month in brackets fixed the 'expected 2 arguments but got 3' error */
        ({year,
        month}),
        dayjs(`${year}-${month}-01`).daysInMonth()
    )

    previousMonthDays = createPreviousMonthDays(year, month)

    nextMonthDays = createNextMonthDays(year, month)

    const days = [...previousMonthDays, ...currentMonthDays, ...nextMonthDays]
        /*[...] is spread syntax; allows deconstruction of arrays into separate variables */

    days.forEach((day) => {
        appendDay(day, calendarDays)
    })
}

function appendDay(day, calendarDays) {
    const elementDay = document.createElement('li')
    const elementDayClassList = elementDay.classList
    elementDayClassList.add('calendar_day')
    const dayOfMonthElement = document.createElement('span')
    dayOfMonthElement.innerText = day.dayOfMonth
    elementDay.appendChild(dayOfMonthElement)
    calendarDays.appendChild(elementDay)

    if(!day.isCurrentMonth) {
        elementDayClassList.add('not_current_day')
    }

    if (day.date === TODAY) {
        elementDayClassList.add('today_calendar_day')
    }
}

function getNumberOfDaysInMonth(year, month) {
    return dayjs(`${year}-${month}-01`).daysInMonth();
}

function createCurrentMonthDays (year, month) {
    
    return [...Array(getNumberOfDaysInMonth(year, month))].map((day, index) => {
        return {
            date: dayjs(`${year}-${month}-${index +1}`).format('YYYY-MM-DD'),
            dayOfMonth: index +1,
            isCurrentMonth: true,
        }
    })
}

function createPreviousMonthDays (year, month) {
    const firstDayOfTheMonthWeekday = getWeekday(currentMonthDays[0].date)

    const previousMonth = dayjs(`${year}-${month}-01`).subtract(1, 'month')

    /*cover first sunday w ternary operator (?), stick to this for variable assignment*/
    const visibleDaysOfPreviousMonth =
    firstDayOfTheMonthWeekday
        ? firstDayOfTheMonthWeekday - 1
        : 6

    const previousMonthFinalMonday = dayjs(currentMonthDays[0].date).subtract(visibleDaysOfPreviousMonth, 'day').date()

    return [...Array(visibleDaysOfPreviousMonth)].map((day, index) => {
        return {
            date: dayjs(`${previousMonth.year()}-${previousMonth.month() + 1}-${previousMonthFinalMonday + index}`).format('YYYY-MM-DD'),
            dayOfMonth: previousMonthFinalMonday + index,
            isCurrentMonth: false,
        };
    });
}

function createNextMonthDays(year, month) {
    const lastDayOfMonthWeekday = getWeekday(
        `${year}-${month}-${currentMonthDays.length}`
    )

    const nextMonth = dayjs(`${year}-${month}-01`).add(1, 'month')

    const visibleDaysOfNextMonth =
    lastDayOfMonthWeekday
        ? 7 - lastDayOfMonthWeekday 
        : lastDayOfMonthWeekday

    return [...Array(visibleDaysOfNextMonth)].map((day, index) => {
        return {
            date: dayjs(
                `${nextMonth.year()}-${nextMonth.month() + 1}-${index +1}`
            ).format('YYYY-MM-DD'),
            dayOfMonth: index + 1,
            isCurrentMonth: false,
        }
    })
}

function getWeekday(date) {
    /*check https://day.js.org/docs/en/get-set/day if this one is wonky */
    return dayjs(date).day()
}

function removeAllDayElements(calendarDays) {
    let first = calendarDays.firstElementChild;
  
    while (first) {
      first.remove();
      first = calendarDays.firstElementChild;
    }
  }

function initMonthSelectors() {
    /*functionality for previous month*/
    document.getElementById('previous_month')
    .addEventListener('click', function () {
        selectedMonth = dayjs(selectedMonth).subtract(1, 'month');
        createCalendar(selectedMonth.format('YYYY'), selectedMonth.format('M'))
    })

    /*for current month*/
    document.getElementById('current_month')
    .addEventListener('click', function () {
        selectedMonth = dayjs(new Date(+INITIAL_YEAR, +INITIAL_MONTH - 1, 1));
        createCalendar(selectedMonth.format('YYYY'),
        selectedMonth.format('M'))
    })

    /*for next month */
    document.getElementById('next_month')
    .addEventListener('click', function () {
        selectedMonth = dayjs(selectedMonth).add(1, 'month');
        createCalendar(selectedMonth.format('YYYY'),
        selectedMonth.format('M'))
    })
}

export default function Calendar() {
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
    )
}
