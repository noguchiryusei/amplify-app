import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; 
import "./Calendar.css";
import GetCalendarNotes from './CalendarSearch';

type Note = {
  id: string;
  name: string;
  year: string;
  month: string;
  day: string;
  star: string;
  description: string;
  icon?: string;
  image?: string;
};

function CalendarRender() {
  const [date, setDate] = useState(new Date());
  const [notes, setNotes] = useState<Note[]>([]);

  const onChange = (newDate) => {
    setDate(newDate);
  };

  const handleNotesFetched = (fetchedNotes) => {
    setNotes(fetchedNotes);
  };

  const tileContent = ({ date, view }) => {
    if (view === 'month') {
      const foundNotes = notes.filter(note => 
        note.year === date.getFullYear() && 
        note.month === (date.getMonth() + 1) && 
        note.day === date.getDate()
      );

      if (foundNotes.length > 0) {
        return (
          <div>
            {foundNotes.map(note => (
              <div key={note.id}>
                <img
                  src={`${process.env.PUBLIC_URL}/logo192.png`}
                  alt={note.name}
                  style={{ width: '20px', height: '20px' }}
                />
                <br />
                {note.name}
              </div>
            ))}
          </div>
        );
      }
    }
    return null;  // デフォルトでは何も表示しない
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

      <GetCalendarNotes 
        year={date.getFullYear()} 
        month={date.getMonth() + 1}
        onNotesFetched={handleNotesFetched}
      />
    </div>
  );
}

export default CalendarRender;