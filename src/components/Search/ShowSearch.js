import React, {useEffect, useState} from 'react';
import { generateClient } from 'aws-amplify/api';
import { getUrl } from 'aws-amplify/storage';
import StarView from '../Search/Star';
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
      date
      createdAt
      updatedAt
      __typename
    }
  }
`;

const client = generateClient();
const GetNoteById = ({ id, onSelectPage }) => {
  const [note, setNote] = useState(null);
  useEffect(() => {
    const getNote = async () => {
      try {
        const apiData = await client.graphql({
          query: getNoteQuery,
          variables: { id }
        });
        const noteFromAPI = apiData.data.getNote;
        if (noteFromAPI.image) {
          const url = await getUrl({ key: noteFromAPI.image });
          noteFromAPI.image = url.url.toString();
        }
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
      <StarView star={note.star}/>
      {note.image && (
        <Image
          src={note.image}
          alt={`visual aid for ${note.name}`}
          style={{ height: 300 }}
        />
      )}
      <button  onClick={() => onSelectPage('search')}>もどる</button>
    </div>
  );
};

export default GetNoteById;