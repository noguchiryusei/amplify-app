import React, { useState, useEffect } from "react";
import conf from '../../assets/aws-exports'
import { Amplify } from 'aws-amplify'
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
import {getUrl, remove } from 'aws-amplify/storage';

Amplify.configure(conf)
const client = generateClient();

const Searcher: React.FC = () => {
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    fetchNotes();
  }, []);

  async function fetchNotes() {
    const apiData = await client.graphql({ query: listNotes });
    const notesFromAPI = apiData.data.listNotes.items;
    await Promise.all(
      notesFromAPI.map(async (note) => {
        if (note.image) {
          const url = await getUrl({ key: note.name });
          const icon = await getUrl({ key: note.icon });
          note.image = url.url;
          note.icon = icon.url; 
        }
        return note;
      })
    );
    setNotes(notesFromAPI);
  }
  async function deleteNote({ id, name }) {
    const newNotes = notes.filter((note) => note.id !== id);
    setNotes(newNotes);
    await remove({ key: name });
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
            {note.name}
          </Text>
          <Text as="span">
            {note.description}
          </Text>
          {note.icon && (
            <Image
              src={note.icon}
              alt={`visual aid for ${note.name}`}
              style={{ height: 60 }}
            />
          )}
          {note.image && (
            <Image
              src={note.image}
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