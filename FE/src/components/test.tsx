import { useState } from "react";
import axios from "axios";

const TransliterateInput = () => {
  const [text, setText] = useState("");
  const [lastTranslatedWord, setLastTranslatedWord] = useState("");

  const handleChange = async (e: { target: { value: any; }; }) => {
    let inputText = e.target.value;

    // Check if user added a space (word completed)
    if (inputText.endsWith(" ")) {
      const words = inputText.trim().split(/\s+/);
      const lastWord = words[words.length - 1];

      if (lastWord && lastWord !== lastTranslatedWord) {
        try {
          const response = await axios.get(
            `https://inputtools.google.com/request?itc=hi-t-i0-und&text=${encodeURIComponent(lastWord)}&num=1`
          );

          if (response.data && response.data[0] === "SUCCESS") {
            const translatedWord = response.data[1][0][1][0]; // Get transliteration
            words[words.length - 1] = translatedWord;

            // Preserve spaces and update the text
            setText(words.join(" ") + " ");
            setLastTranslatedWord(lastWord);
          }
        } catch (error) {
          console.error("Error fetching transliteration:", error);
        }
      } else {
        setText(inputText); // Just update normally
      }
    } else {
      setText(inputText); // Keep updating input normally
    }
  };

  return (
    <div>
      <h2>Live Hinglish to Hindi Transliteration</h2>
      <textarea
        rows={4}
        cols={50}
        value={text}
        onChange={handleChange}
        placeholder="Type in Hinglish..."
      />
    </div>
  );
};

export default TransliterateInput;
