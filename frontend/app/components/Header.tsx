import Image from "next/image";

interface HeaderProps { 
    link: string;
    linkText: string;
}

const Header = ({ link, linkText }: HeaderProps) => {
    return (
        <header className="flex items-center justify-between p-4 bg-gray-900">
            {/* Logo */}
            <div className="flex items-center space-x-2">
                <Image src="/engineerly-logo.jpg" alt="App Logo" width={40} height={40} />
                <h1 className="text-xl font-bold">EngineerlyAI</h1>
            </div>
            {/* Help Link */}
            <div className="space-x-4">
                <a
                    href="https://github.com/UmairK5669/EngineerlyAI"
                    className="underline hover:no-underline"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Repository
                </a>
                <a
                    href={`/${link}`}
                    className="underline hover:no-underline"
                >
                    {linkText}
                </a>
            </div>
        </header>
    );
};

export default Header;
