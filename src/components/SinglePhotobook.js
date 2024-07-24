// src/components/SinglePhotobook.js
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useAuth } from "../context/AuthContext";
import { getPhotobook, updatePhotobook } from "../utils/firebaseUtils";
import TagInput from "./TagInput";
import LoadingSpinner from "./LoadingSpinner";

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`;

const Title = styled.h1`
  text-align: center;
  margin-bottom: 20px;
`;

const Description = styled.p`
  text-align: center;
  margin-bottom: 30px;
`;

const PhotoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
`;

const PhotoCard = styled.div`
  background-color: rgba(225, 227, 172, 0.15);
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }
`;

const PhotoImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
  cursor: pointer;
`;

const PhotoInfo = styled.div`
  padding: 15px;
`;

const PhotoTitle = styled.h3`
  margin: 0 0 10px 0;
`;

const InfoItem = styled.p`
  margin: 5px 0;
  font-size: 14px;
`;

const EditButton = styled.button`
  background-color: ${(props) => props.theme.colors.primary};
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 10px;
`;

const FullScreenOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const FullScreenImage = styled.img`
  max-width: 90%;
  max-height: 90%;
  object-fit: contain;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  background-color: transparent;
  color: white;
  border: none;
  font-size: 24px;
  cursor: pointer;
`;

const EditForm = styled.form`
  background-color: white;
  padding: 20px;
  border-radius: 8px;
`;

const GroupBySelect = styled.select`
  appearance: none; // Remove default styling
  background-color: rgba(225, 227, 172, 0.15);
  border: 0px solid ${(props) => props.theme.colors.secondary}; // Teal border
  border-radius: 8px;
  padding: 12px 36px 12px 16px; // Extra padding on the right for the custom arrow
  font-size: 16px;
  color: ${(props) => props.theme.colors.text};
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 20px;

  // Custom arrow
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%232EC4B6' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  background-size: 16px;

  &:hover {
    border-color: ${(props) => props.theme.colors.primary}; // Orange on hover
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  &:focus {
    outline: none;
    border-color: ${(props) => props.theme.colors.primary};
    box-shadow: 0 0 0 3px rgba(46, 196, 182, 0.3); // Teal focus ring
  }

  // Style for the options
  option {
    background: white;
    color: ${(props) => props.theme.colors.text};
    padding: 8px;
  }
`;

const GroupByLabel = styled.label`
  font-weight: bold;
  margin-right: 10px;
  color: ${(props) => props.theme.colors.secondary};
`;
const GroupContainer = styled.div`
  margin-bottom: 30px;
`;

const GroupTitle = styled.h2`
  margin-bottom: 15px;
  color: ${(props) => props.theme.colors.primary};
`;

const SinglePhotobook = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [photobook, setPhotobook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fullScreenPhoto, setFullScreenPhoto] = useState(null);
  const [editingPhoto, setEditingPhoto] = useState(null);
  const [savingChanges, setSavingChanges] = useState(false);
  const [groupBy, setGroupBy] = useState("none");

  useEffect(() => {
    const fetchPhotobook = async () => {
      if (user) {
        try {
          const fetchedPhotobook = await getPhotobook(id);
          setPhotobook(fetchedPhotobook);
        } catch (error) {
          console.error("Error fetching photobook:", error);
          // Handle error (e.g., show error message to user)
        } finally {
          setLoading(false);
        }
      }
    };
    fetchPhotobook();
  }, [id, user]);

  const handlePhotoUpdate = async (updatedPhoto) => {
    setSavingChanges(true);
    try {
      const updatedPhotos = photobook.photos.map((photo) =>
        photo.url === updatedPhoto.url ? updatedPhoto : photo
      );
      await updatePhotobook(id, { photos: updatedPhotos });
      setPhotobook((prevBook) => ({
        ...prevBook,
        photos: updatedPhotos,
      }));
      setEditingPhoto(null);
    } catch (error) {
      console.error("Error updating photo:", error);
      // Handle error (e.g., show error message to user)
    } finally {
      setSavingChanges(false);
    }
  };

  const safeJoin = (value, separator = ", ") => {
    if (Array.isArray(value)) {
      return value.join(separator);
    }
    return value || "";
  };

  const groupPhotos = (photos, metric) => {
    if (metric === "none") return { "All Photos": photos };

    return photos.reduce((groups, photo) => {
      const key = Array.isArray(photo[metric])
        ? photo[metric].join(", ")
        : photo[metric] || "Unspecified";
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(photo);
      return groups;
    }, {});
  };

  const renderGroupedPhotos = () => {
    const groupedPhotos = groupPhotos(photobook.photos, groupBy);

    return Object.entries(groupedPhotos).map(([group, photos]) => (
      <GroupContainer key={group}>
        <GroupTitle>{group}</GroupTitle>
        <PhotoGrid>
          {photos.map((photo, index) => renderPhotoCard(photo, index))}
        </PhotoGrid>
      </GroupContainer>
    ));
  };

  const renderPhotoCard = (photo, index) => (
    <PhotoCard key={photo.url || index}>
      <PhotoImage
        src={photo.url}
        alt={photo.title}
        onClick={() => setFullScreenPhoto(photo)}
      />
      <PhotoInfo>
        <PhotoTitle>{photo.title}</PhotoTitle>
        <InfoItem>Film Stock: {safeJoin(photo.filmStock)}</InfoItem>
        <InfoItem>People: {safeJoin(photo.people)}</InfoItem>
        <InfoItem>Location: {photo.location || ""}</InfoItem>
        <InfoItem>Event: {safeJoin(photo.event)}</InfoItem>
        <EditButton onClick={() => setEditingPhoto({ ...photo })}>
          Edit
        </EditButton>
      </PhotoInfo>
    </PhotoCard>
  );

  if (loading) return <LoadingSpinner />;
  if (!photobook) return <div>Photobook not found</div>;

  return (
    <Container>
      <Title>{photobook.title}</Title>
      <Description>{photobook.description}</Description>
      <div>
        {/* <GroupByLabel htmlFor="group-by">Group photos by:</GroupByLabel> */}
        <GroupBySelect
          value={groupBy}
          onChange={(e) => setGroupBy(e.target.value)}
        >
          <option value="none">No Grouping</option>
          <option value="filmStock">Group by Film Stock</option>
          <option value="people">Group by People</option>
          <option value="event">Group by Event</option>
        </GroupBySelect>
      </div>
      {groupBy === "none" ? (
        <PhotoGrid>
          {photobook.photos.map((photo, index) =>
            renderPhotoCard(photo, index)
          )}
        </PhotoGrid>
      ) : (
        renderGroupedPhotos()
      )}

      {fullScreenPhoto && (
        <FullScreenOverlay onClick={() => setFullScreenPhoto(null)}>
          <FullScreenImage
            src={fullScreenPhoto.url}
            alt={fullScreenPhoto.title}
          />
          <CloseButton onClick={() => setFullScreenPhoto(null)}>
            &times;
          </CloseButton>
        </FullScreenOverlay>
      )}

      {editingPhoto && (
        <FullScreenOverlay onClick={() => setEditingPhoto(null)}>
          <EditForm onClick={(e) => e.stopPropagation()}>
            <input
              type="text"
              value={editingPhoto.title || ""}
              onChange={(e) =>
                setEditingPhoto({ ...editingPhoto, title: e.target.value })
              }
              placeholder="Title"
            />
            <TagInput
              tagType="filmStock"
              value={
                Array.isArray(editingPhoto.filmStock)
                  ? editingPhoto.filmStock
                  : []
              }
              onChange={(value) =>
                setEditingPhoto({ ...editingPhoto, filmStock: value })
              }
            />
            <TagInput
              tagType="people"
              value={
                Array.isArray(editingPhoto.people) ? editingPhoto.people : []
              }
              onChange={(value) =>
                setEditingPhoto({ ...editingPhoto, people: value })
              }
            />
            <input
              type="text"
              value={editingPhoto.location || ""}
              onChange={(e) =>
                setEditingPhoto({ ...editingPhoto, location: e.target.value })
              }
              placeholder="Location"
            />
            <TagInput
              tagType="event"
              value={
                Array.isArray(editingPhoto.event) ? editingPhoto.event : []
              }
              onChange={(value) =>
                setEditingPhoto({ ...editingPhoto, event: value })
              }
            />
            <button
              onClick={() => handlePhotoUpdate(editingPhoto)}
              disabled={savingChanges}
            >
              {savingChanges ? "Saving..." : "Save Changes"}
            </button>
          </EditForm>
        </FullScreenOverlay>
      )}
    </Container>
  );
};

export default SinglePhotobook;
