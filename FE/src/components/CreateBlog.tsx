import React, { useState } from "react";
import { useQuill } from "react-quilljs";
import "quill/dist/quill.snow.css";
import { ReactTransliterate } from "react-transliterate";
import "react-transliterate/dist/index.css";
import axios from "axios";

const BlogEditor = () => {
  const [images, setImages] = useState([]);
  const [imageUrls, setImageUrls] = useState([]);
  const [HindiOption, setHindiOption] = useState(false);

  // New fields
  const [mainHeading, setMainHeading] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");

  const handleFileChange = (event) => {
    const selectedFiles = Array.from(event.target.files).slice(0, 6); // Limit to 6 images
    setImages(selectedFiles);
  };

  const handleUpload = async () => {
    if (images.length === 0) {
      alert("Please select up to 6 images!");
      return;
    }

    const formData = new FormData();
    images.forEach((image) => formData.append("images", image));
    try {
      const response = await axios.post("http://localhost:5000/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setImageUrls(response.data.imageUrls);
      alert("Images uploaded successfully!");
    } catch (error) {
      console.error("Error uploading images:", error);
    }
  };

  const { quill, quillRef } = useQuill();
  const [transliterateText, setTransliterateText] = useState("");

  const insertTextIntoQuill = () => {
    if (quill && transliterateText.trim() !== "") {
      const range = quill.getSelection(); // Get cursor position
      const insertIndex = range ? range.index : quill.getLength(); // Default to end if no selection

      quill.insertText(insertIndex, transliterateText); // Insert text
      quill.setSelection(insertIndex + transliterateText.length); // Move cursor forward
      quill.focus(); // Keep focus inside Quill editor
      setTransliterateText(""); // Clear input after inserting
    }
  };

  return (
    <div>
      <h2>Blog Editor</h2>

      {/* Main Heading Field */}
      <input
        type="text"
        value={mainHeading}
        onChange={(e) => setMainHeading(e.target.value)}
        placeholder="Enter Main Heading"
        className="w-full p-2 border border-gray-300 rounded mb-3"
      />

      {/* Location Field */}
      <input
        type="text"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        placeholder="Enter Location"
        className="w-full p-2 border border-gray-300 rounded mb-3"
      />

      {/* Date Field */}
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded mb-3"
      />

      {/* File Upload */}
      <div>
        <input type="file" multiple accept="image/*" onChange={handleFileChange} />
        <button onClick={handleUpload}>Submit</button>

        {imageUrls.length > 0 && (
          <div>
            <p>Uploaded Images:</p>
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              {imageUrls.map((url, index) => (
                <img key={index} src={url} alt={`Uploaded ${index}`} width="150" />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Quill Editor */}
      <div>
        <div ref={quillRef} style={{ height: "250px", marginTop: "10px", border: "1px solid #ccc" }} />

        {/* Hindi Transliteration Option */}
        {HindiOption ? (
          <div>
            <ReactTransliterate
              value={transliterateText}
              onChangeText={setTransliterateText}
              lang="hi"
              containerStyles={{ flexGrow: 1 }}
              renderComponent={(props) => (
                <input
                  {...props}
                  style={{
                    width: "100%",
                    padding: "8px",
                    borderRadius: "5px",
                    border: "1px solid #ccc",
                    fontSize: "16px",
                  }}
                  placeholder="Type Hinglish here..."
                />
              )}
            />
            <button
              onClick={insertTextIntoQuill}
              style={{
                padding: "8px 15px",
                borderRadius: "5px",
                border: "none",
                backgroundColor: "#007bff",
                color: "white",
                cursor: "pointer",
              }}
            >
              Insert
            </button>
          </div>
        ) : null}

        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-3"
          onClick={() => setHindiOption(!HindiOption)}
        >
          Hindi Option
        </button>
      </div>
    </div>
  );
};

export default BlogEditor;
