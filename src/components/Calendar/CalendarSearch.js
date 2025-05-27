import { listNotes } from "../../graphql/queries";
import { generateClient } from 'aws-amplify/api';

const client = generateClient();

function GetCalendarNotes({ startDate, endDate, onNotesFetched }) {

  const fetchNotes = async () => {
    try {
      const filter = {
        date: {
          between: [startDate, endDate],
        },
      };
      const apiData = await client.graphql({
        query: listNotes,
        variables: { filter }
      });
      const notesFromAPI = apiData.data.listNotes.items;
      onNotesFetched(notesFromAPI);
    } catch (error) {
      console.error("ノートの取得中にエラーが発生しました:", error);
    }
  };

  fetchNotes();
  return null;
}

export default GetCalendarNotes;