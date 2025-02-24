import React, { useState } from "react";
import { useQuill } from "react-quilljs";
import "quill/dist/quill.snow.css";
import { ReactTransliterate } from "react-transliterate";
import "react-transliterate/dist/index.css";
import axios from "axios";
import { BACKEND_URL } from "../config";
  
const BlogEditor = () => {
  const [images, setImages] = useState<File[]>();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [imageUrls, setImageUrls] = useState([]);
  const [HindiOption, setHindiOption] = useState(false);
  const [mainHeading, setMainHeading] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const { quill, quillRef } = useQuill();
  const [transliterateText, setTransliterateText] = useState("");
  const [blogContent, setBlogContent] = useState(""); // Store blog content separately
  const [imageUpload, setImageUpload]=useState(false);

  // Handle file selection
  const handleFileChange = (event:React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files?.length ? Array.from(event.target.files) : [];
  
    setImages(files.slice(0, 6)); // Limit to 6 images
    setImageUpload(false);
  };

  // Upload images to backend
  

  // Insert transliterated text into Quill editor
  const insertTextIntoQuill = () => {
    if (quill && transliterateText.trim() !== "") {
      const range = quill.getSelection();
      const insertIndex = range ? range.index : quill.getLength();
      quill.insertText(insertIndex, transliterateText);
      quill.setSelection(insertIndex + transliterateText.length);
      quill.focus();
      setTransliterateText("");
    }
  };

  // Capture blog content from Quill editor
  React.useEffect(() => {
    if (quill) {
      quill.on("text-change", () => {
        setBlogContent(quill.root.innerHTML); // Store content as HTML
      });
    }
  }, [quill]);

  // Handle form submission
  const handleSubmit = async () => {
    if (!mainHeading || !location || !date || !blogContent) {
      alert("Please fill out all fields before submitting.");
      return;
    }

    const formData = new FormData();
    formData.append("heading", mainHeading);
    formData.append("dateTime", date);
    formData.append("location", location);
    formData.append("body", blogContent); // Send Quill HTML content

    // Append images

    images?.forEach((image) => formData.append("images", image));


    try {
      for (const pair of formData.entries()) {
        console.log(pair[0], pair[1]);
      }
      
      const response = await axios.post( `${BACKEND_URL}/blog/create`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Blog submitted successfully!");
      console.log("Response:", response.data);
    } catch (error) {
      if(imageUpload==false){
        console.log("uploaded images");
        alert("Images Uploaded");
        return
        
      }
      console.error("Submission error:", error);
      alert("Failed to submit blog.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-semibold text-center mb-4">Blog Editor</h2>

      {/* Main Heading Field */}
      <input
        type="text"
        value={mainHeading}
        onChange={(e) => setMainHeading(e.target.value)}
        placeholder="Enter Main Heading"
        className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:ring focus:ring-blue-200 outline-none"
      />

      {/* Location & Date Fields */}
      <div className="grid grid-cols-2 gap-4">
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Enter Location"
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200 outline-none"
        />

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200 outline-none"
        />
      </div>

      {/* File Upload */}
      <div className="mt-6">
        <label className="block text-sm font-medium text-gray-700">Upload Images (Max 6)</label>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileChange}
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200 outline-none"
        />
        

        {imageUrls.length > 0 && (
          <div className="mt-4">
            <p className="text-sm text-gray-500 mb-2">Uploaded Images:</p>
            <div className="flex flex-wrap gap-3">
              {imageUrls.map((url, index) => (
                <img key={index} src={url} alt={`Uploaded ${index}`} className="w-20 h-20 rounded-lg object-cover" />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Quill Editor */}
      <div className="mt-6">
        <label className="block text-sm font-medium text-gray-700">Blog Content</label>
        <div ref={quillRef} className="h-40 mt-2 border border-gray-300 rounded-lg" />

        {/* Hindi Transliteration Option */}
        {HindiOption && (
          <div className="mt-4">
            <ReactTransliterate
              value={transliterateText}
              onChangeText={setTransliterateText}
              lang="hi"
              containerStyles={{ flexGrow: 1 }}
              renderComponent={(props) => (
                <input
                  {...props}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200 outline-none"
                  placeholder="Type Hinglish here..."
                />
              )}
            />
            <button
              onClick={insertTextIntoQuill}
              className="mt-2 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg w-full transition"
            >
              Insert
            </button>
          </div>
        )}

        <button
          className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg w-full transition"
          onClick={() => setHindiOption(!HindiOption)}
        >
          {HindiOption ? "Hide Hindi Option" : "Enable Hindi Option"}
        </button>
      </div>

      {/* Submit Button */}
      <button
          onClick={handleSubmit}
          className="mt-2 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg w-full transition"
        >
          Upload Images
        </button>
      <button
        className="mt-6 bg-purple-600 hover:bg-purple-700 text-white py-3 px-6 rounded-lg w-full transition"
        onClick={handleSubmit}
      >
        Submit Blog
      </button>
    </div>
  );
};

export default BlogEditor;
