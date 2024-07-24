// src/components/TagInput.js
import React from "react";
import CreatableSelect from "react-select/creatable";
import useTags from "../hooks/useTags";

const TagInput = ({ tagType, value, onChange }) => {
  const { tags, addTag } = useTags(tagType);

  const options = tags.map((tag) => ({ value: tag, label: tag }));

  const handleChange = (selectedOptions) => {
    onChange(
      selectedOptions ? selectedOptions.map((option) => option.value) : []
    );
  };

  const handleCreate = async (inputValue) => {
    await addTag(inputValue);
    const newOption = { value: inputValue, label: inputValue };
    onChange([...value, inputValue]);
    return newOption;
  };

  return (
    <CreatableSelect
      isMulti
      options={options}
      value={value.map((v) => ({ value: v, label: v }))}
      onChange={handleChange}
      onCreateOption={handleCreate}
      placeholder={`Add ${tagType}...`}
      formatCreateLabel={(inputValue) => `Add new ${tagType}: "${inputValue}"`}
      noOptionsMessage={() =>
        `No ${tagType} options available. Type to create a new one.`
      }
    />
  );
};

export default TagInput;
