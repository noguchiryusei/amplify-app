import React, { useState, useEffect } from "react";

import { generateClient } from 'aws-amplify/api';
import {
  Button,
  Flex,
  Text,
  Image,
  View,
} from "@aws-amplify/ui-react";
import { listNotes } from "../../graphql/queries";
import {
  deleteNote as deleteNoteMutation,
} from "../../graphql/mutations";
import { getUrl, remove } from 'aws-amplify/storage';

const client = generateClient();

// Noteの型を定義
type Note = {
  id: string;
  name: string;
  date: string;
  star: string;
  description: string;
  icon?: string;
  image?: string;
};

interface SeacherProps {
  onSelectPage: (page: string) => void;
  setId: (page: string) => void;
}

const Searcher: React.FC<SeacherProps> = ({onSelectPage, setId}) => {
  const [notes, setNotes] = useState<Note[]>([]);

  useEffect(() => {
    fetchNotes();
  }, []);

  async function fetchNotes() {
    const apiData = await client.graphql({ query: listNotes });
    const notesFromAPI: Note[] = (apiData as any).data.listNotes.items;
    await Promise.all(
      notesFromAPI.map(async (note) => {
        if (note.image) {
          const url = await getUrl({ key: note.image });
          const icon = await getUrl({ key: note.icon as string });
          note.image = url.url.toString();
          note.icon = icon.url.toString(); 
        }
        return note;
      })
    );
    setNotes(notesFromAPI);
  }

  async function deleteNote({ id, name }: { id: string, name: string }) {
    const newNotes = notes.filter((note) => note.id !== id);
    setNotes(newNotes);
    await remove({ key: id });
    await client.graphql({
      query: deleteNoteMutation,
      variables: { input: { id } },
    });
  }
  
  return (
    <View margin="3rem 0">
      {notes.map((note) => (
        <Flex
          key={note.id || note.name}
          direction="row"
          justifyContent="center"
          alignItems="center"
        >
          <Text as="strong" fontWeight={700}>
            <button onClick={() => 
              {
                setId(note.id);
                onSelectPage('show')
              }
            }>
            {note.name}
            </button>
          </Text>
          <Text>
            {note.date}
          </Text>
          {note.icon && (
            <Image
              src={note.icon}
              alt={`visual aid for ${note.name}`}
              style={{ height: 60 }}
            />
          )}
          <Button variation="link" onClick={() => deleteNote(note)}>
            Delete note
          </Button>
        </Flex>
      ))}
    </View>
  );
};

export default Searcher;