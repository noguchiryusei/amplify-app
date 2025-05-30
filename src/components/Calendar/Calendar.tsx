import React, { useState, useRef, useEffect} from 'react';
import { getUrl } from 'aws-amplify/storage';
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid"
import GetCalendarNotes from './CalendarSearch';
import interactionPlugin from "@fullcalendar/interaction";
import './Calendar.css';
import { Calendar } from '@fullcalendar/core';
import { s } from '@fullcalendar/core/internal-common';



type Note = {
  id: string;
  name: string;
  date: string;
  star: string;
  description: string;
  icon?: string;
  image?: string;
};

interface CalendarProps {
  onSelectPage: (page: string) => void;
  setId: (id: string) => void;
  initialDateFromShow: string;
}

const CalendarRender: React.FC<CalendarProps> = ({onSelectPage, setId, initialDateFromShow}) => {
  const calendarRef = useRef(null)
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [notes, setNotes] = useState<Note[]>([]);

  const today = new Date().toISOString().split('T')[0];
  const initialDate = initialDateFromShow || today;

  useEffect(() => {
    if (!startDate || !endDate) return;
    GetCalendarNotes({
      startDate: startDate,
      endDate: endDate,
      onNotesFetched: handleNotesFetched
    });
  }, [startDate, endDate]);

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

  return (
    <div>
      <FullCalendar
        locale='ja'
        allDayText="終日"
        height="80%"
        ref={calendarRef}
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        selectable={true}
        weekends={true}
        initialDate={initialDate}
        titleFormat={{
            year:"numeric",
            month:"short"
        }}
        events = {(fetchInfo, successCallback) => {
          setStartDate(fetchInfo['startStr']);
          setEndDate(fetchInfo['endStr']);

          const events = notes.map(note => ({
            title: note.name,
            start: `${note.date}`,
            id: note.id
          }));

          successCallback(events);
        }}
        eventClick={(info) => 
          {
            setId(info.event.id);
            onSelectPage('show')
          }
        }
    />
    </div>
  );
}

export default CalendarRender;