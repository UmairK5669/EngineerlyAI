'use client'

import { useState, useEffect, useRef } from "react";

const options = ["205", "222", "240", "204", "250"];

const Home = () => {
  const [prompt, setPrompt] = useState("");
  const [filteredOptions, setFilteredOptions] = useState<string[]>([]);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [submittedPrompts, setSubmittedPrompts] = useState<string[]>([]);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;

    if (value.startsWith("/")) {
      const query = value.slice(1);
      setFilteredOptions(
        options.filter((option) => option.startsWith(query))
      );
      setIsDropdownVisible(true);
    } else {
      setIsDropdownVisible(false);
    }
    setPrompt(value);
  };

  const handleOptionSelect = (option: string) => {
    setPrompt(`/${option} `);
    setSelectedOptions([`/${option}`]);
    setIsDropdownVisible(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (isDropdownVisible && filteredOptions.length === 1 && e.key === "Enter") {
      e.preventDefault();
      handleOptionSelect(filteredOptions[0]);
    } else if (e.key === "Backspace") {
      if (prompt.startsWith("/") && selectedOptions.includes(prompt.trim())) {
        setSelectedOptions([]);
        setPrompt("");
      }
    } else if (e.key === "Enter" && prompt.trim()) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    if (prompt.trim() && selectedOptions.length) {
      setSubmittedPrompts((prev) => [...prev, prompt]);
      setPrompt("");
      setSelectedOptions([]);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-800 text-white flex flex-col items-center p-6">
      <div className="relative w-full max-w-lg mb-6">
        <textarea
          value={prompt}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          className="w-full h-32 p-4 bg-gray-900 text-white border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Type your prompt here..."
        />
        {isDropdownVisible && filteredOptions.length > 0 && (
          <div
            ref={dropdownRef}
            className="absolute top-full left-0 w-full bg-gray-700 text-white border border-gray-600 rounded-lg shadow-lg mt-2 max-h-40 overflow-y-auto"
          >
            {filteredOptions.map((option) => (
              <div
                key={option}
                onClick={() => handleOptionSelect(option)}
                className="px-4 py-2 cursor-pointer hover:bg-gray-600"
              >
                {option}
              </div>
            ))}
          </div>
        )}
      </div>
      <button
        onClick={handleSubmit}
        disabled={!prompt.trim() || selectedOptions.length === 0}
        className={`px-6 py-2 rounded-lg ${
          prompt.trim() && selectedOptions.length
            ? "bg-blue-500 hover:bg-blue-600"
            : "bg-gray-600 cursor-not-allowed"
        }`}
      >
        Submit
      </button>
      <div className="mt-6 w-full max-w-lg">
        <h3 className="text-lg font-semibold mb-2">Submitted Prompts:</h3>
        {submittedPrompts.map((submittedPrompt, index) => (
          <p key={index} className="bg-gray-700 p-2 rounded-lg mb-2">
            {submittedPrompt}
          </p>
        ))}
      </div>
    </div>
  );
};

export default Home;
