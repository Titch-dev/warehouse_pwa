import React, { useState } from 'react';
import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { PickersDay } from '@mui/x-date-pickers/PickersDay';
import { createTheme, ThemeProvider} from '@mui/material/styles';
import OpeningHours from '../opening-hours';

import styles from './event-calendar.module.css';

const calendarTheme = createTheme({
  components: {
    // Header label
    MuiPickersCalendarHeader: {
      styleOverrides: {
        label: {
          fontSize: '1.7rem',
          color: 'var(--color-grey-light-3)',
        },
        switchViewButton: {
          color: 'var(--color-grey-light-3)',
          fontSize: '1.5rem',
        },
        button: {
          color: 'var(--color-grey-light-3)',
          fontSize: '3rem',
        },
      },
    },
    // Header arrows
    MuiPickersArrowSwitcher: {
      styleOverrides: {
        button: {
          color: 'var(--color-grey-light-3)',
          fontSize:'3rem',
          '&.Mui-disabled': {
            color: 'var(--color-grey-dark-3)'
          }
        }
      }
    },
    // Days of the week label
    MuiTypography: {
      styleOverrides: {
        root: {
          '&.MuiDayCalendar-weekDayLabel': {
            color: 'var(--color-grey-light-3)',
            fontSize: '1.4rem',
            fontWeight: 'bold',
          }
        }
      }
    },
    MuiPickersDay:{
      styleOverrides: {
        root: {
          '&.Mui-selected': {
            backgroundColor: 'transparent',
          }
        }
      }
    }
  },
});

const EventCalendar = ({ events, onEventSelect, selectedEvent }) => {
  const [selectedDate, setSelectedDate] = useState(dayjs(selectedEvent.start));
  const today = dayjs();

  // Get events for a specific date
  const getEventsForDate = (date) => {
    return events.filter(event => {
      const eventDate = dayjs(event.start);
      return eventDate.isSame(date, 'day');
    });
  };

 // Check if this day matches the currently selected event
  const isSelectedEventDay = (date) => {
    if (!selectedEvent) return false;
    const eventDate = dayjs(selectedEvent.start);
    return eventDate.isSame(date, 'day');
  };

  // Check if a date has events
  const hasEventsOnDate = (date) => {
    return getEventsForDate(date).length > 0;
  };

  // Custom day renderer
  const CustomDay = (props) => {
    const { day, ...other } = props;
    const hasEvent = hasEventsOnDate(day);
    const isToday = day.isSame(today, 'day');
    const notEventDay = day.isBefore(today, 'day') || !hasEvent && !isToday;
    const isSelectedEvent = isSelectedEventDay(day)

    return (
      <div className={styles.dayWrapper}>
        <PickersDay
          {...other}
          day={day}
          disabled={notEventDay || isToday && !hasEvent}
          className={`
            ${styles.customDay} 
            ${isToday ? styles.todayDay : ''} 
            ${hasEvent ? styles.eventDay : ''}
            ${isSelectedEvent ? styles.selectedEventDay : ''}
            ${notEventDay ? styles.notEventDay : ''}
          `}
          onClick={() => {
            setSelectedDate(day);
            if (hasEvent) {
              const dayEvents = getEventsForDate(day);
              if (dayEvents.length > 0 && onEventSelect) {
                onEventSelect(dayEvents[0]); // Select first event of the day
              }
            }
          }}
        />
        {hasEvent && <div className={styles.eventDot} />}
      </div>
    );
  };

  return (
    <div className={styles.calendarContainer}>
      <ThemeProvider theme={calendarTheme}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DateCalendar
            value={selectedDate}
            onChange={setSelectedDate}
            slots={{
              day: CustomDay,
            }}
            showDaysOutsideCurrentMonth
            className={styles.calendar}
            disablePast
            minDate={today}
          />
        </LocalizationProvider>
      </ThemeProvider>
      <div className={styles.opening_time_container}>
        <OpeningHours date={today}/>
      </div>
    </div>
  );
};

export default EventCalendar;