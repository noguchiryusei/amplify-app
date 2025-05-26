import React, { useState, useRef, useEffect } from 'react';
// import Calendar from 'react-calendar';
import './Calendar.css';
import GetCalendarNotes from './CalendarSearch';
import { getUrl } from 'aws-amplify/storage';
import ReturnDate from './GetDate';

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid"

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
  const calendarRef = useRef(null)
  const [date, setDate] = useState(() => new Date());
  const [notes, setNotes] = useState<Note[]>([]);
  useEffect(() => {
    GetCalendarNotes({
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      onNotesFetched: handleNotesFetched
    });
  }, [date]);
  
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

  };


  return (
    <div>
      <FullCalendar
        locale='ja'
        allDayText="終日"
        height="80%"
        ref={calendarRef}
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
        slotDuration="00:30:00"
        selectable={true}
        weekends={true}
        titleFormat={{
            year:"numeric",
            month:"short"
        }}
        events = {(fetchInfo, successCallback, failureCallback) => {
          if (date.getTime() !== fetchInfo['start'].getTime()) {
            setDate(fetchInfo['start']);
          }

          const events = notes.map(note => ({
            title: note.name,
            start: `${note.year}-${String(note.month).padStart(2, '0')}-${String(note.day).padStart(2, '0')}`,
            extendedProps: {
              description: note.description,
              icon: note.icon,
              image: note.image
            }
          }));
          successCallback(events);
        }}
        // eventClick={}//ユーザーがイベントをクリックしたときにトリガーされます。
        // select={}//日時が選択されるとトリガーされる
    />
    </div>
  );
}

export default CalendarRender;