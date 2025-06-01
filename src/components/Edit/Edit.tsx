import React, { useState } from 'react';
import conf from '../../assets/aws-exports'
import { Amplify } from 'aws-amplify'
import { generateClient } from 'aws-amplify/api';
import {
  Button,
  Flex,
  TextField,
  View,
} from "@aws-amplify/ui-react";
import {
  createNote as createNoteMutation,
} from "../../graphql/mutations";
import { uploadData } from 'aws-amplify/storage';
import StarRating from '../Search/Star.js';
import { compressImage, compressImageType } from "../../util/compress.ts"

type Note = {
  id: string;
  name: string;
  date: string;
  star: string;
  description: string;
  icon?: string;
  image?: string;
};

Amplify.configure(conf)
const client = generateClient();

interface EditDataProps {
  onSelectPage: (page: string) => void;
  editData?: Note;
}

const EditData: React.FC<EditDataProps> = ({onSelectPage, editData}) => {
  const [selectedRating, setSelectedRating] = useState(0);

  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  const formattedDate = `${year}-${month}-${day}`;

  const handleRatingUpdate = (rating) => {
    setSelectedRating(rating);
  };

  async function createNote(event) {
    event.preventDefault();
    const form = new FormData(event.target);
    var image = form.get("image");
    var icon;

    if (!!image && (image as File).type.startsWith("image/")) {
      icon = await compressImage(image as File);
      const options: compressImageType = {
        maxSizeMB: 0.1,
        useWebWorker: true,
        initialQuality: 0.8,
        maxWidthOrHeight: 800,
      };
      image = await compressImage(image as File, options);

      await uploadData({
        key: icon.name,
        data: icon,
      });
      await uploadData({
        key: image.name,
        data: image,
      });
    }
    const date = String(form.get("date"));

    const data = {
      name: form.get("name"),
      star: selectedRating,
      description: form.get("description"),
      date: date,
      icon: icon?.name,
      image: (image as File)?.name,
      link: form.get("link"),
    };
    await client.graphql({
      query: createNoteMutation,
      variables: { input: data },
    });
    event.target.reset();
    onSelectPage('calendar');
  }

  return (
    <View margin="3rem 0">
      <View as="form" margin="3rem 0" onSubmit={createNote}>
        <Flex direction="column" justifyContent="center">
          <TextField
            name="date"
            value={editData.date}
            labelHidden
            type="date"
            variation="quiet"
            label="Note Date"
            defaultValue={formattedDate}
          />
          <TextField
            name="name"
            value={editData.name}
            placeholder="料理名"
            label="Note Name"
            labelHidden
            variation="quiet"
            required
          />
          <TextField
            name="link"
            value={editData.link}
            placeholder="リンク"
            label="Note Link"
            labelHidden
            variation="quiet"
          />
          <StarRating onRatingChange={handleRatingUpdate} />
          <TextField
            name="description"
            value={editData.description}
            placeholder="コメント"
            label="Note Description"
            labelHidden
            variation="quiet"
          />
          <View
            name="image"
            as="input"
            type="file"
          />
          <Button type="submit" variation="primary">
            Edit Note
          </Button>
        </Flex>
      </View>
    </View>
  );
};

export default EditData;