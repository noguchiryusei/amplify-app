import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './Calendar.css';
import GetCalendarNotes from './CalendarSearch';
import { listNotes } from "../../graphql/queries";
import { getUrl } from 'aws-amplify/storage';
import { generateClient } from 'aws-amplify/api';
const client = generateClient();

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

  // GetCalendarNotesからノートを受け取る
  const handleNotesFetched = async (fetchedNotes: Note[]) => {
    const updatedNotes = await Promise.all(
      fetchedNotes.map(async (note) => {
        if (note.icon) {
          const iconUrl = await getUrl({ key: note.icon });
          note.icon = iconUrl.url.toString();
        }
        return note;
      })
    );
    
    setNotes(updatedNotes);
  };

  const tileContent = ({ date, view }) => {
    if (view === 'month') {
      const foundNotes = notes.filter(note =>
        parseInt(note.year) === date.getFullYear() && 
        parseInt(note.month) === (date.getMonth() + 1) && 
        parseInt(note.day) === date.getDate()
      );

      if (foundNotes.length > 0) {
        return (
          <div>
            {foundNotes.map(note => (
              <div key={note.id}> {/* unique keyを追加 */}
                {note.icon && (
                  <img
                    src={note.icon}
                    alt={note.name}
                    style={{ width: '20px', height: '20px' }}
                  />
                )}
              </div>
            ))}
          </div>
        );
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
      <GetCalendarNotes
        year={date.getFullYear()}
        month={date.getMonth() + 1}
        onNotesFetched={handleNotesFetched}
      />
    </div>
  );
}

export default CalendarRender;