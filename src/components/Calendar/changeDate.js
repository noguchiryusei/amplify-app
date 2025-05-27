import { listNotes } from "../../graphql/queries";
import { updateNote } from "../../graphql/mutations"; // ミューテーションのインポート
import { generateClient } from 'aws-amplify/api';

const client = generateClient();

function ChangeNotes() {

    const fetchNotes = async () => {
        try {
            const apiData = await client.graphql({
                query: listNotes
            });
            const notesFromAPI = apiData.data.listNotes.items;
            console.log("Fetched notes:", notesFromAPI);

            for (const note of notesFromAPI) {
                const formattedDate = formatDate(note.year, note.month, note.day);
                
                // ミューテーションを使ってdateを更新
                await client.graphql({
                    query: updateNote,
                    variables: {
                        input: {
                            id: note.id,
                            date: formattedDate
                        }
                    }
                });

                console.log(`Updated note ID: ${note.id} with new date: ${formattedDate}`);
            }

        } catch (error) {
            console.error("Error fetching or updating notes:", error);
        }
    };

    // 年、月、日から日付フォーマットを作成する関数
    const formatDate = (year, month, day) => {
        const formattedMonth = String(month).padStart(2, '0');
        const formattedDay = String(day).padStart(2, '0');
        return `${year}-${formattedMonth}-${formattedDay}`;
    }

    fetchNotes();

    return null;
}

export default ChangeNotes;