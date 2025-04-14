import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; 
import "./Calendar.css";

function CalendarRender() {
  const [date, setDate] = useState(new Date());

  const onChange = (newDate) => {
    setDate(newDate);
  };
  const tileContent = ({ date, view }) => {
    if (view === 'month') {
      if (date.getDate()  === 5) {
        return <img
        src={`${process.env.PUBLIC_URL}/logo192.png`}
        alt="example"
        style={{
          width: `${100 / 10}vw`,
          height: `${100 / 20}vh`
        }}
      />;
      }else{
        return "test2\ntest";
      }
    }
    return null;
  };

  return (
    <div>
      <h3>My Calendar</h3>
      <Calendar
        onChange={onChange}
        value={date}
        calendarType="gregory"
        tileContent={tileContent}
      />
    </div>
  );
}

export default CalendarRender;