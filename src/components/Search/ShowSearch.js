import React, {useEffect, useState} from 'react';
import { generateClient } from 'aws-amplify/api';
import { getUrl } from 'aws-amplify/storage';
import {
  Image,
} from "@aws-amplify/ui-react";

const getNoteQuery = `
  query GetNote($id: ID!) {
    getNote(id: $id) {
      id
      user
      name
      image
      icon
      star
      description
      link
      year
      month
      day
      createdAt
      updatedAt
      __typename
    }
  }
`;

const client = generateClient();
const GetNoteById = ({ id }) => {
  const [note, setNote] = useState(null);

  useEffect(() => {
    const getNote = async () => {
      try {
        const apiData = await client.graphql({
          query: getNoteQuery,
          variables: { id }
        });
        const noteFromAPI = apiData.data.getNote;
        const url = await getUrl({ key: noteFromAPI.image });
        console.log("URL:", url);
        noteFromAPI.image = url.url.toString();
        setNote(noteFromAPI);
      } catch (error) {
        console.error("Error fetching note:", error);
      }
    };

    getNote();
  }, [id]);

  if (!note) return <div>Loading...</div>;

  return (
    <div>
      <h2>{note.name}</h2>
      <p>{note.description}</p>
      {note.image && (
        <Image
          src={note.image}
          alt={`visual aid for ${note.name}`}
          style={{ height: 300 }}
        />
      )}
      
    </div>
  );
};

export default GetNoteById;