// src/components/CreatePhotobook.js
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useAuth } from "../context/AuthContext";
import { addDoc, collection } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "../firebase/config";
import { useNavigate } from "react-router-dom";
import { getPhotobookCount, addUserTag } from "../utils/firebaseUtils";

import LoadingSpinner from "./LoadingSpinner";
import TagInput from "./TagInput"; // Import the new TagInput component

const Container = styled.div`
  max-width: 800px;
  margin: 80px auto 0; // Add top margin here
  padding: 40px 20px;
  background-color: #f9f9f9;
  border-radius: 15px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const InputGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
  color: #333;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.3s ease;

  &:focus {
    outline: none;
    border-color: ${(props) => props.theme.colors.primary};
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  resize: vertical;
  min-height: 100px;
  transition: border-color 0.3s ease;

  &:focus {
    outline: none;
    border-color: ${(props) => props.theme.colors.primary};
  }
`;

const Button = styled.button`
  padding: 12px 24px;
  font-size: 16px;
  font-weight: bold;
  background-color: ${(props) => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: ${(props) => props.theme.colors.secondary};
  }
`;

const ImagePreviewContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
`;

const ImageMetadataContainer = styled.div`
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const ImagePreview = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 10px;
`;

// const TagInput = styled.div`
//   display: flex;
//   flex-wrap: wrap;
//   gap: 5px;
//   margin-bottom: 10px;
// `;

const Tag = styled.span`
  background-color: ${(props) => props.theme.colors.secondary};
  color: white;
  padding: 5px 10px;
  border-radius: 15px;
  display: flex;
  align-items: center;
  font-size: 14px;
`;

const RemoveTagButton = styled.button`
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  margin-left: 5px;
  font-size: 16px;
  font-weight: bold;
`;

const FileInput = styled.input`
  display: none;
`;

const FileInputLabel = styled.label`
  display: inline-block;
  padding: 12px 24px;
  background-color: ${(props) => props.theme.colors.secondary};
  color: white;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: ${(props) => props.theme.colors.primary};
  }
`;
const ErrorMessage = styled.p`
  color: red;
  margin-top: 10px;
`;

const PhotoCount = styled.p`
  margin-top: 10px;
  font-weight: bold;
  color: ${(props) => props.theme.colors.secondary};
`;

const CreatePhotobook = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [photos, setPhotos] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const checkPhotobookLimit = async () => {
      if (user) {
        try {
          const count = await getPhotobookCount(user.uid);
          if (count >= 10) {
            navigate("/view", {
              state: {
                error: "You've reached the maximum limit of 10 photobooks.",
              },
            });
          }
        } catch (error) {
          console.error("Error checking photobook count:", error);
          setError("An error occurred. Please try again later.");
        } finally {
          setIsLoading(false);
        }
      }
    };

    checkPhotobookLimit();
  }, [user, navigate]);

  const handleImageChange = (e) => {
    if (e.target.files) {
      const newPhotos = Array.from(e.target.files).map((file) => ({
        file,
        preview: URL.createObjectURL(file),
        title: "",
        filmStock: [],
        people: [],
        location: "",
        caption: "",
        event: [],
      }));

      if (photos.length + newPhotos.length > 20) {
        setError("You can only add up to 20 photos per photobook.");
        return;
      }

      setPhotos([...photos, ...newPhotos]);
      setError("");
    }
  };

  // ... (previous handlePhotoMetadataChange, handleAddTag, handleRemoveTag functions remain the same)
  const handlePhotoMetadataChange = async (index, field, value) => {
    const updatedPhotos = [...photos];
    updatedPhotos[index][field] = value;
    setPhotos(updatedPhotos);

    // If the field is filmStock, people, or event, update the user's tags
    if (["filmStock", "people", "event"].includes(field)) {
      for (const tag of value) {
        await addUserTag(user.uid, field, tag);
      }
    }
  };

  const handleAddTag = (index, field) => {
    const updatedPhotos = [...photos];
    const currentValue = updatedPhotos[index][field];
    if (
      currentValue &&
      !updatedPhotos[index][`${field}s`].includes(currentValue)
    ) {
      updatedPhotos[index][`${field}s`] = [
        ...updatedPhotos[index][`${field}s`],
        currentValue,
      ];
      updatedPhotos[index][field] = "";
    }
    setPhotos(updatedPhotos);
  };

  const handleRemoveTag = (index, field, tag) => {
    const updatedPhotos = [...photos];
    updatedPhotos[index][`${field}s`] = updatedPhotos[index][
      `${field}s`
    ].filter((t) => t !== tag);
    setPhotos(updatedPhotos);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;

    if (photos.length === 0) {
      setError("Please add at least one photo to your photobook.");
      return;
    }

    setIsCreating(true);
    setError("");

    try {
      const photosData = await Promise.all(
        photos.map(async (photo) => {
          const imageRef = ref(
            storage,
            `photobooks/${user.uid}/${photo.file.name}`
          );
          await uploadBytes(imageRef, photo.file);
          const url = await getDownloadURL(imageRef);
          return {
            url,
            title: photo.title,
            filmStock: photo.filmStock,
            people: photo.people,
            location: photo.location,
            caption: photo.caption,
            event: photo.event,
          };
        })
      );

      await addDoc(collection(db, "photobooks"), {
        title,
        description,
        photos: photosData,
        userId: user.uid,
        createdAt: new Date(),
      });

      navigate("/view");
    } catch (error) {
      console.error("Error adding photobook: ", error);
      setError(
        "An error occurred while creating the photobook. Please try again."
      );
    } finally {
      setIsCreating(false);
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <Container>
      {isCreating && <LoadingSpinner />}
      <h1>Create New Photobook</h1>
      <Form onSubmit={handleSubmit}>
        {/* ... (previous form fields remain the same) */}
        <InputGroup>
          <Label htmlFor="title">Photobook Title</Label>
          <Input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </InputGroup>
        <InputGroup>
          <Label htmlFor="description">Photobook Description</Label>
          <TextArea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </InputGroup>
        <InputGroup>
          <FileInputLabel htmlFor="photo-upload">
            Upload Photos (Max 20)
          </FileInputLabel>
          <FileInput
            id="photo-upload"
            type="file"
            onChange={handleImageChange}
            accept="image/*"
            multiple
          />
        </InputGroup>
        <PhotoCount>Photos: {photos.length} / 20</PhotoCount>

        {/* ... (previous photo metadata inputs remain the same) */}
        <ImagePreviewContainer>
          {photos.map((photo, index) => (
            <ImageMetadataContainer key={index}>
              <ImagePreview src={photo.preview} alt={`Preview ${index + 1}`} />
              <Input
                type="text"
                placeholder="Photo Title"
                value={photo.title}
                onChange={(e) =>
                  handlePhotoMetadataChange(index, "title", e.target.value)
                }
              />
              <TagInput
                tagType="filmStock"
                value={photo.filmStock}
                onChange={(value) =>
                  handlePhotoMetadataChange(index, "filmStock", value)
                }
              />
              <TagInput
                tagType="people"
                value={photo.people}
                onChange={(value) =>
                  handlePhotoMetadataChange(index, "people", value)
                }
              />
              <Input
                type="text"
                placeholder="Location"
                value={photo.location}
                onChange={(e) =>
                  handlePhotoMetadataChange(index, "location", e.target.value)
                }
              />
              <TextArea
                placeholder="Caption"
                value={photo.caption}
                onChange={(e) =>
                  handlePhotoMetadataChange(index, "caption", e.target.value)
                }
              />
              <TagInput
                tagType="event"
                value={photo.event}
                onChange={(value) =>
                  handlePhotoMetadataChange(index, "event", value)
                }
              />
            </ImageMetadataContainer>
          ))}
        </ImagePreviewContainer>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        <Button type="submit" disabled={photos.length === 0 || isCreating}>
          {isCreating ? "Creating Photobook..." : "Create Photobook"}
        </Button>
      </Form>
    </Container>
  );
};

export default CreatePhotobook;
