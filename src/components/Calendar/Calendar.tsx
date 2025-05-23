import React, { useState, useRef } from 'react';
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
  const [date, setDate] = useState(new Date());
  const [notes, setNotes] = useState<Note[]>([]);
  
  // useRefはコンポーネントのトップレベルで使用
  // const labelRef = useRef<HTMLSpanElement | null>(null);

  // const onChange = (newDate: Date) => {
  //   setDate(newDate);
  //   console.log(newDate);
  // };

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

  const thisMonth = () => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(
      2,
      "0"
    )}`;
  };

  const calendarApi = (calendarRef.current as any)?.getApi();
  function goNext() {
    ReturnDate();
    calendarApi?.next();
    console.log("goNext");
  }
  function goBack() {
    calendarApi.prev()
    console.log("goBack");
  }
  function goToday() {
    console.log(thisMonth());
    calendarApi.today()
    console.log("goToday");
  }

  // const tileContent = ({ date, view }: { date: Date, view: string }) => {
  //   if (view === 'month') {
  //     const foundNotes = notes.filter(note =>
  //       parseInt(note.year) === date.getFullYear() && 
  //       parseInt(note.month) === (date.getMonth() + 1) && 
  //       parseInt(note.day) === date.getDate()
  //     );

  //     if (foundNotes.length > 0) {
  //       return (
  //         <div>
  //           {foundNotes.map(note => (
  //             <div key={note.id}>
  //               {note.icon && (
  //                 <img
  //                   src={note.icon}
  //                   alt={note.name}
  //                   style={{ width: '20px', height: '20px' }}
  //                 />
  //               )}
  //             </div>
  //           ))}
  //         </div>
  //       );
  //     }
  //   }
  //   return null;
  // };

  return (
    <div>
      {/* <Calendar
        onChange={onChange}
        value={date}
        calendarType="gregory"
        tileContent={tileContent}
      /> */}
      <GetCalendarNotes
        year={date.getFullYear()}
        month={date.getMonth() + 1}
        onNotesFetched={handleNotesFetched}
      />
      <button onClick={goBack}>Go Back!</button>
      <button onClick={goToday}>Go Today!</button>
      <button onClick={goNext}>Go Next!</button>
      <FullCalendar
        locale='ja'
        allDayText="終日"
        height="80%"
        // Remove the 'width' property
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
        headerToolbar={{
          start: undefined,
          center: "title",
          end: undefined
            // start:"title",
            // center:"prev,today,next",
            // end:"dayGridMonth"
        }}
        events={[
          { title: "event 1", date: `${thisMonth()}-01` },
          { title: "event 2", date: `${thisMonth()}-02` },
          { title: "event 2", date: `${thisMonth()}-32` },
        ]}
        // eventClick={}//ユーザーがイベントをクリックしたときにトリガーされます。
        // select={}//日時が選択されるとトリガーされる
    />
    </div>
  );
}

export default CalendarRender;