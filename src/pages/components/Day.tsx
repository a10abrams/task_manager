import { constants } from 'perf_hooks';
import React from 'react';

interface DayProps {
  date: string;
  dayOfMonth: number;
  isCurrentMonth: boolean;
  today: string;
  events: any[];
  observancesData: any[];
  allYearDays: any[];
}

// Map event ID's to unicode symbols
const unicodeSymbolsMap = {
  newYears: '\u{2739}', // 12-pointed star
  mlkDay : '\u{1F54A}', // white dove
  washBirth : '\u{D80C}\u{DF0F}', //hatchet
  valDay : '\u{2661}', // heart
  earthDay : '\u{2672}', // recycle symbol
  memDay : '\u{2698}', // flower
  june19 : '\u{25A0}', // black square
  july4 : '\u{2691}', //flag
  labDay : '\u{2692}', // hammer + pick
  secondMon : '\u{13185}', //feather
  vetDay : '\u{272F}', // pinwheel star
  thxDay : '\u{270C}', // peace fingers
  halloween : '\u{2620}', // skull and cross bones
  christmas : '\u{2603}', // happy snowman
}

const Day: React.FC<DayProps> = ({ date, dayOfMonth, isCurrentMonth, today, events, observancesData, allYearDays }) => {
  // Check if the day has any user-created events
  const hasUserEvents = events?.length > 0;

  // Check if the day is in observancesData; added optional chaning (if `obsData` is undefined, proceed with `some`)
  const isObservance = observancesData?.some((observance) => observance.date === date);

  // Get the id of the observance
  const observanceId = isObservance ? observancesData.find((observance) => observance.date === date).id : '';

  // Determine content based on the conditions
  let content;
  if (hasUserEvents && isObservance && unicodeSymbolsMap[observanceId]) {
    content = `${dayOfMonth} ${unicodeSymbolsMap[observanceId]}`;
  } else if (hasUserEvents && date !== today) {
    content = `${dayOfMonth} *`;
  } else if (isObservance && unicodeSymbolsMap[observanceId]) {
    content = `${dayOfMonth} ${unicodeSymbolsMap[observanceId]}`;
  } else {
    content = dayOfMonth.toString();
  }

  // Set CSS classes based on conditions
  const dayClasses = `day_grid ${!isCurrentMonth ? "not_current_day" : ""} ${
    date === today ? "today_calendar_day" : ""
  } ${observanceId ? `observance_${observanceId}` : ''} ${hasUserEvents ? 'user_events' : ''}`;

  return (
    <li className={dayClasses} data-date={date}>
      <span dangerouslySetInnerHTML={{ __html: content }}></span>
    </li>
  );
};

export default Day;
