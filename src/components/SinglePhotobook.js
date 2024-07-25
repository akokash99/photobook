// src/components/SinglePhotobook.js
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useAuth } from "../context/AuthContext";
import { getPhotobook, updatePhotobook } from "../utils/firebaseUtils";
import TagInput from "./TagInput";
import LoadingSpinner from "./LoadingSpinner";
import * as S from "../styles/SinglePhotobookStyles";

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
      <S.GroupContainer key={group}>
        <S.GroupTitle>{group}</S.GroupTitle>
        <S.PhotoGrid>
          {photos.map((photo, index) => renderPhotoCard(photo, index))}
        </S.PhotoGrid>
      </S.GroupContainer>
    ));
  };

  const renderPhotoCard = (photo, index) => (
    <S.PhotoCard key={photo.url || index}>
      <S.PhotoImage
        src={photo.url}
        alt={photo.title}
        onClick={() => setFullScreenPhoto(photo)}
      />
      <S.PhotoInfo>
        <S.PhotoTitle>{photo.title}</S.PhotoTitle>
        <S.InfoItem>Film Stock: {safeJoin(photo.filmStock)}</S.InfoItem>
        <S.InfoItem>People: {safeJoin(photo.people)}</S.InfoItem>
        <S.InfoItem>Location: {photo.location || ""}</S.InfoItem>
        <S.InfoItem>Event: {safeJoin(photo.event)}</S.InfoItem>
        <S.EditButton onClick={() => setEditingPhoto({ ...photo })}>
          Edit
        </S.EditButton>
      </S.PhotoInfo>
    </S.PhotoCard>
  );

  if (loading) return <LoadingSpinner />;
  if (!photobook) return <div>Photobook not found</div>;

  return (
    <S.Container>
      <S.Title>{photobook.title}</S.Title>
      <S.Description>{photobook.description}</S.Description>
      <div>
        {/* <GroupByLabel htmlFor="group-by">Group photos by:</GroupByLabel> */}
        <S.GroupBySelect
          value={groupBy}
          onChange={(e) => setGroupBy(e.target.value)}
        >
          <option value="none">No Grouping</option>
          <option value="filmStock">Group by Film Stock</option>
          <option value="people">Group by People</option>
          <option value="event">Group by Event</option>
        </S.GroupBySelect>
      </div>
      {groupBy === "none" ? (
        <S.PhotoGrid>
          {photobook.photos.map((photo, index) =>
            renderPhotoCard(photo, index)
          )}
        </S.PhotoGrid>
      ) : (
        renderGroupedPhotos()
      )}

      {fullScreenPhoto && (
        <S.FullScreenOverlay onClick={() => setFullScreenPhoto(null)}>
          <S.FullScreenImage
            src={fullScreenPhoto.url}
            alt={fullScreenPhoto.title}
          />
          <S.CloseButton onClick={() => setFullScreenPhoto(null)}>
            &times;
          </S.CloseButton>
        </S.FullScreenOverlay>
      )}

      {editingPhoto && (
        <S.FullScreenOverlay onClick={() => setEditingPhoto(null)}>
          <S.EditForm onClick={(e) => e.stopPropagation()}>
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
          </S.EditForm>
        </S.FullScreenOverlay>
      )}
    </S.Container>
  );
};

export default SinglePhotobook;
