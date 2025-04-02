import React from "react";
import conf from '../../assets/aws-exports'
import { Amplify } from 'aws-amplify'
import { generateClient } from 'aws-amplify/api';
import {
  Button,
  Flex,
  TextField,
  View,
  Input,
} from "@aws-amplify/ui-react";
import {
  createNote as createNoteMutation,
} from "../../graphql/mutations";
import { uploadData } from 'aws-amplify/storage';

import { compressImage, compressImageType } from "../../util/compress.ts"

Amplify.configure(conf)
const client = generateClient();

const AddData: React.FC = () => {

  async function createNote(event) {
    event.preventDefault();
    const form = new FormData(event.target);
    var image = form.get("image");
    var icon;
    

    if (!!image && image.type.startsWith("image/")) {
      icon = await compressImage(image);
      const options: compressImageType = {
        maxSizeMB: 0.1,
        useWebWorker: true,
        initialQuality: 0.8,
        maxWidthOrHeight: 800,
      };
      image = await compressImage(image, options);
      
      
      await uploadData({
      key: icon.name,
      data: icon,
      });
      await uploadData({
      key: image.name,
      data: image,
      });
    }
    const data = {
      name: form.get("name"),
      description: form.get("description"),
      date: form.get("date"),
      icon: icon?.name,
      image: image?.name,
    };
    await client.graphql({
      query: createNoteMutation,
      variables: { input: data },
    });
    event.target.reset();
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
          label="Note Date" // Add the label prop with a value
        />
          <TextField
            name="name"
            placeholder="Note Name"
            label="Note Name"
            labelHidden
            variation="quiet"
            required
          />
          <TextField
            name="description"
            placeholder="Note Description"
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