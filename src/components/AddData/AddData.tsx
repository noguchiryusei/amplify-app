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
import StarRating from './StarRationg.js';
import { compressImage, compressImageType } from "../../util/compress.ts"

Amplify.configure(conf)
const client = generateClient();

interface AddDataProps {
  onSelectPage: (page: string) => void;
}

const AddData: React.FC<AddDataProps> = ({onSelectPage}) => {
  const [selectedRating, setSelectedRating] = useState(0);
  
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
    const [year, month, day] = date ? date.split('-') : [null, null, null];
    
    const data = {
      name: form.get("name"),
      star: selectedRating,
      description: form.get("description"),
      year: year,
      month: month,
      day: day,
      icon: icon?.name,
      image: (image as File)?.name,
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
            placeholder="Note Name"
            labelHidden
            type="date"
            label="Note Date"
          />
          <TextField
            name="name"
            placeholder="料理名"
            label="Note Name"
            labelHidden
            variation="quiet"
            required
          />
          <TextField
            name="link"
            placeholder="リンク"
            label="Note Link"
            labelHidden
            variation="quiet"
            required
          />
          <StarRating onRatingChange={handleRatingUpdate} />
          <TextField
            name="description"
            placeholder="コメント"
            label="Note Description"
            labelHidden
            variation="quiet"
            required
          />
          <View
            name="image"
            as="input"
            type="file"
          />
          <Button type="submit" variation="primary">
            Create Note
          </Button>
        </Flex>
      </View>
      </View>
  );
};

export default AddData;