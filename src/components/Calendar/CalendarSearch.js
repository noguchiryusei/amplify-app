import React, {useEffect} from 'react';
import { listNotes } from "../../graphql/queries";
import { generateClient } from 'aws-amplify/api';

const client = generateClient();
function GetCalendarNotes({ year, month, onNotesFetched }) {
  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const filter = { year: { eq: year }, month: { eq: month } };
        const apiData = await client.graphql({
          query: listNotes,
          variables: { filter }
        });
        const notesFromAPI = apiData.data.listNotes.items;
        onNotesFetched(notesFromAPI);
      } catch (error) {
        console.error("Error fetching notes:", error);
      }
    };

    fetchNotes();
  }, [year, month, onNotesFetched]);

  return null;
}

export default GetCalendarNotes;