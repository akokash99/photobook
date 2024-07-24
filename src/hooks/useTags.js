// src/hooks/useTags.js
import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import { getUserTags, addUserTag } from "../utils/firebaseUtils";

const useTags = (tagType) => {
  const [tags, setTags] = useState([]);
  const { user } = useAuth();

  const fetchTags = useCallback(async () => {
    if (user) {
      const userTags = await getUserTags(user.uid, tagType);
      setTags(userTags);
    }
  }, [user, tagType]);

  useEffect(() => {
    fetchTags();
  }, [fetchTags]);

  const addTag = async (newTag) => {
    if (user) {
      await addUserTag(user.uid, tagType, newTag);
      await fetchTags(); // Refresh the tags after adding a new one
    }
  };

  return { tags, addTag };
};

export default useTags;
