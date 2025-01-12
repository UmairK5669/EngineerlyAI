'use client'

import Header from "../components/Header";
import HelpText from "../components/HelpText";

const Help = () => {
    return (
      <div className="min-h-screen bg-gray-800 text-white">
        <Header link="" linkText="Home"/>
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-4">How to use EngineerlyAI</h1>
          <HelpText />
          <p className="mt-4">
            For any additional questions or feedback, please create an issue on the <a className="underline hover:no-underline" target="_blank" href="https://github.com/UmairK5669/EngineerlyAI">project repository</a>.
          </p>
        </div>
      </div>
    );
  };
  
  export default Help;
  