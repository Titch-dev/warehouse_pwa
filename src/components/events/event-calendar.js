'use client';

import { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { PickersDay } from '@mui/x-date-pickers/PickersDay';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Tooltip from '@mui/material/Tooltip';
import { getOpeningHoursForToday } from '@/lib/utils';
import { OPENING_TIMES } from '@/config/openingTimes';

import styles from './event-calendar.module.css';

const calendarTheme = createTheme({
  components: {
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
    MuiPickersArrowSwitcher: {
      styleOverrides: {
        button: {
          color: 'var(--color-grey-light-3)',
          fontSize: '3rem',
          '&.Mui-disabled': {
            color: 'var(--color-grey-dark-3)',
          },
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          '&.MuiDayCalendar-weekDayLabel': {
            color: 'var(--color-grey-light-3)',
            fontSize: '1.4rem',
            fontWeight: 'bold',
          },
        },
      },
    },
    MuiPickersDay: {
      styleOverrides: {
        root: {
          '&.Mui-selected': {
            backgroundColor: 'transparent',
          },
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          fontSize: '1.3rem',
          backgroundColor: 'var(--color-grey-dark-1)',
          color: 'var(--color-grey-light-3)',
        },
        arrow: {
          color: 'var(--color-grey-dark-2)',
        },
      },
    },
  },
});

const EventCalendar = ({ events = [], onEventSelect, selectedEvent }) => {
  const today = dayjs();
  const [selectedDate, setSelectedDate] = useState(today);
  const { open, close } = getOpeningHoursForToday(OPENING_TIMES);

  useEffect(() => {
    if (!selectedEvent) return;
    setSelectedDate(dayjs(selectedEvent.start_time));
  }, [selectedEvent]);

  const getEventsForDate = (date) => {
    return events.filter((event) => dayjs(event.start_time).isSame(date, 'day'));
  };

  const isSelectedEventDay = (date) => {
    if (!selectedEvent) return false;
    return dayjs(selectedEvent.start_time).isSame(date, 'day');
  };

  const CustomDay = (props) => {
    const { day, ...other } = props;

    const dayEvents = getEventsForDate(day);
    const hasEvent = dayEvents.length > 0;

    const isToday = day.isSame(today, 'day');
    const isSelectedEvent = isSelectedEventDay(day);

    const notEventDay = day.isBefore(today, 'day') || (!hasEvent && !isToday);

    const tooltipTitle = hasEvent ? dayEvents[0]?.name ?? 'Event' : '';

    return (
      <div className={styles.dayWrapper}>
        <Tooltip
        title={tooltipTitle}
        placement="top"
        arrow
        enterDelay={200}
        disableHoverListener={!hasEvent}
        disableFocusListener={!hasEvent}
        disableTouchListener={!hasEvent}
      >
        <span>
          <PickersDay
            {...other}
            day={day}
            disabled={notEventDay || (isToday && !hasEvent)}
            className={`
              ${styles.customDay}
              ${isToday ? styles.todayDay : ''}
              ${hasEvent ? styles.eventDay : ''}
              ${isSelectedEvent ? styles.selectedEvent : ''}
              ${notEventDay ? styles.notEventDay : ''}
            `}
            onClick={() => {
              setSelectedDate(day);
              if (hasEvent && onEventSelect) onEventSelect(dayEvents[0]);
            }}
          />
        </span>
      </Tooltip>

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
            slots={{ day: CustomDay }}
            showDaysOutsideCurrentMonth
            className={styles.calendar}
            disablePast
            minDate={today}
          />
        </LocalizationProvider>
      </ThemeProvider>

      <div className={styles.info_container}>
        <div className={styles.opening_hours}>
          <p><strong>Open Today</strong></p>
          <p>{open} - {close}</p>
        </div>
      </div>
    </div>
  );
};

export default EventCalendar;