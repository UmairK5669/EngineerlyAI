'use client';

import { useState, useEffect, useRef } from "react";
import Header from "./components/Header";
import HelpText from "./components/HelpText";

const options = ["205", "222", "240", "204", "250"];

const Home = () => {
  const [prompt, setPrompt] = useState("");
  const [filteredOptions, setFilteredOptions] = useState<string[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [chatHistory, setChatHistory] = useState<
    { user: string; bot: string | null }[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showHelp, setShowHelp] = useState(true);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const BACKEND_API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL;
  const BACKEND_API_KEY = process.env.NEXT_PUBLIC_BACKEND_API_KEY;

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (isLoading) return;

    const value = e.target.value;

    if (
      (e.nativeEvent as InputEvent).inputType === "deleteContentBackward" &&
      selectedCourse &&
      value === `/${selectedCourse}`
    ) {
      setPrompt("");
      setSelectedCourse(null);
      setIsDropdownVisible(false);
      return;
    }

    if (value.startsWith("/")) {
      const query = value.slice(1).trim();
      const filtered = options.filter((option) => option.startsWith(query));
      setFilteredOptions(filtered);
      setIsDropdownVisible(filtered.length > 0);

      if (filtered.includes(query)) {
        setSelectedCourse(query);
      }
    } else {
      setIsDropdownVisible(false);
    }

    setPrompt(value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.key === "Enter" || e.key === " ") && filteredOptions.length === 1) {
      e.preventDefault();
      handleOptionSelect(filteredOptions[0]);
    }
  };

  const handleOptionSelect = (option: string) => {
    setPrompt(`/${option} `);
    setSelectedCourse(option);
    setIsDropdownVisible(false);
  };

  const handleSubmit = async () => {
    if (!prompt.trim() || !selectedCourse || prompt.trim() === `/${selectedCourse}`) return;

    setPrompt("");
    setIsLoading(true);

    setChatHistory((prev) => [
      ...prev,
      { user: `/${selectedCourse} ${prompt.trim().slice(selectedCourse.length + 1)}`, bot: null },
    ]);

    try {
      const response = await fetch(`${BACKEND_API_URL}/submit-prompt`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(BACKEND_API_KEY && { "x-api-key": BACKEND_API_KEY }), 
        },
        body: JSON.stringify({
          prompt: prompt.trim(),
          course: selectedCourse,
        }),
      });

      if (!response.ok) {
        console.error("Error:", await response.json());
        setChatHistory((prev) => {
          const updated = [...prev];
          updated[updated.length - 1].bot = "Unable to connect to Gemini, please try again later.";
          return updated;
        });
        setIsLoading(false);
        return;
      }

      const data = await response.json();
      setChatHistory((prev) => {
        const updated = [...prev];
        updated[updated.length - 1].bot = data.response;
        return updated;
      });
    } catch (error) {
      console.error("Error submitting prompt:", error);
      setChatHistory((prev) => {
        const updated = [...prev];
        updated[updated.length - 1].bot = "Unable to connect to Gemini, please try again later.";
        return updated;
      });
    } finally {
      setIsLoading(false);
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
    <div className="min-h-screen bg-gray-800 text-white flex flex-col justify-between">
      <Header link="help" linkText="Help" />
      {showHelp && (
        <div className="p-4 bg-gray-700 text-white">
          <HelpText />
          <button
            onClick={() => setShowHelp(false)}
            className="mt-2 text-sm text-blue-500 hover:underline"
          >
            Close Help
          </button>
        </div>
      )}
      <div className="flex-grow p-6 space-y-4 overflow-y-auto">
        {chatHistory.map((chat, index) => (
          <div key={index} className="flex flex-col space-y-2">
            <div className="self-end bg-blue-500 text-white px-4 py-2 rounded-lg max-w-sm">
              {chat.user}
            </div>
            <div className="self-start bg-gray-700 text-white px-4 py-2 rounded-lg max-w-sm">
              {chat.bot || (isLoading && index === chatHistory.length - 1 && (
                <div className="flex items-center space-x-1">
                  <span>Loading model response</span>
                  <span className="loading-dots">
                    <span>.</span>
                    <span>.</span>
                    <span>.</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="relative w-full p-6 bg-gray-900">
        <textarea
          value={prompt}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
          className="w-full h-16 p-4 bg-gray-700 text-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Type your prompt here (e.g., /205 Explain this...) Note: When the model is responding to a prompt, this field is disabled."
        />
        {isDropdownVisible && (
          <div
            ref={dropdownRef}
            className="absolute bottom-20 left-6 w-full bg-gray-700 text-white border border-gray-600 rounded-lg shadow-lg max-h-40 overflow-y-auto"
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
        <button
          onClick={handleSubmit}
          disabled={
            !prompt.trim() || !selectedCourse || isLoading || prompt.trim() === `/${selectedCourse}`
          }
          className="mt-4 w-full py-2 rounded-lg bg-blue-500 hover:bg-blue-600 disabled:bg-gray-600"
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default Home;
