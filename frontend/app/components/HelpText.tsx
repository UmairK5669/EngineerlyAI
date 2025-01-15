const HelpText = () => {
    return (
        <div>
            <p className="mb-2">Welcome to EngineerlyAI! Here&aposs how to use the app:</p>
            <ol className="list-decimal list-inside space-y-2">
                <li>
                    Start your prompt by typing <code>/COURSE</code>. For example, <code>/205 Explain...</code>.
                </li>
                <li>Use the dropdown to select your course or continue typing the course code manually.</li>
                <li>Press <strong>Enter</strong> to submit your prompt and get a response.</li>
                <li>Subsequent prompts will infer the course from your previous ones.</li>
            </ol>
            <div className="m-3 p-4 bg-yellow-600 text-black rounded-md">
                <p>
                    <strong>Warning:</strong> Model responses take time to come in (2-3 minutes), since the model is fed
                    the course textbook.
                </p>
                <p>
                    <strong>Warning 2:</strong> Please note only 205 is supported at the moment, support for other courses coming soon!
                </p>
            </div>
        </div>
    );
};

export default HelpText;
