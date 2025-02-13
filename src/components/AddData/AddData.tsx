import React from "react";
import conf from '../../assets/aws-exports'
import { Amplify } from 'aws-amplify'
import { generateClient } from 'aws-amplify/api';
import ResizeImage from 'resize-image';
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

Amplify.configure(conf)
const client = generateClient();

const AddData: React.FC = () => {
  const styles = {
    inputFile: {
      '@media (maxWidth: 390px)': {
        width: '100%',
      },
    },
  };

  async function createNote(event) {
    event.preventDefault();
    const form = new FormData(event.target);
    const image = form.get("image");
    const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB

    if (image && image.size > MAX_IMAGE_SIZE) {
      // Handle error: image size exceeds maximum limit
      // Resize the image to a smaller size
      const resizedImage = await ResizeImage.resizeImage(image, MAX_IMAGE_SIZE);
      if (resizedImage) {
        data.image = resizedImage;
      } else {
        return;
      }
    }
    const data = {
      name: form.get("name"),
      description: form.get("description"),
      image: image.name,
    };
    if (!!data.image) await uploadData({
      key: data.name,
      data: image
    });
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