import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; 
import "./Calendar.css";

function CalendarRender() {
  const [date, setDate] = useState(new Date());

  const onChange = (newDate) => {
    setDate(newDate);
  };

  return (
    <div>
      <h1>My Calendar</h1>
      <Calendar
        onChange={onChange}
        value={date}
        calendarType="gregory"
      />
    </div>
  );
}

export default CalendarRender;