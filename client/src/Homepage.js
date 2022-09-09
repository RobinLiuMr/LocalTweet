import { useState, useEffect } from "react";
import CategoryTwitters from "./CategoryTwitters";

const categories = ["Regierung", "Polizei", "Verkehr"];

export default function Homepage() {
    const [searchResults, setSearchResults] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [categoryIndex, setCategoryIndex] = useState(0);
    // default city Frankfurt
    useEffect(() => {
        fetch("/api/twitters/search?q=Frankfurt")
            .then((response) => response.json())
            .then((data) => {
                setSearchResults(data);
            });
    }, []);

    function onSearch(event) {
        event.preventDefault();

        fetch(`/api/twitters/search?q=${searchTerm}`)
            .then((response) => response.json())
            .then((data) => {
                if (!data) {
                    alert(
                        "To be added...For now, only support Frankfurt, Berlin, and Hamburg."
                    );
                    return;
                }
                setSearchResults(data);
            });
    }

    function handelChange(event) {
        setSearchTerm(event.target.value);
    }

    function onMore(event) {
        event.preventDefault();

        fetch(`/api/twitters/more`)
            .then((response) => response.json())
            .then((data) => {
                setSearchResults(data);
            });
    }

    return (
        <div>
            <header className="flex flex-row justify-center">
                {/* modified on https://www.hyperui.dev/components/application-ui/inputs */}
                <label
                    className="relative block p-3 rounded-lg lg:w-1/5"
                    htmlFor="city"
                >
                    <span
                        className="text-md font-medium text-gray-500"
                        htmlFor="name"
                    >
                        Stadt
                    </span>
                    <input
                        className="w-full p-0 text-md border-none focus:ring-0"
                        id="city"
                        value={searchTerm}
                        onChange={handelChange}
                        type="text"
                        placeholder="Frankfurt"
                    />
                </label>

                {/* modified on https://www.hyperui.dev/components/marketing/buttons */}
                <a
                    onClick={onSearch}
                    className="inline-flex items-center px-2 py-2 text-md font-medium text-white transition-colors bg-[#55acee]  rounded hover:bg-transparent hover:text-[#55acee] focus:outline-none focus:ring active:opacity-75"
                    href="#"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Jetzt sehen
                    <svg
                        className="w-5 h-5 ml-2"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                    >
                        <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                    </svg>
                </a>
            </header>

            <main className="text-white bg-gray-900">
                {/* modified on https://www.hyperui.dev/components/application-ui/button-groups */}
                <div className="flex justify-around items-center text-xs -space-x-px rounded-md lg:hidden">
                    {categories.map((category, index) => (
                        <button
                            key={category}
                            onClick={() => setCategoryIndex(index)}
                            className={`px-5 py-3 font-medium border rounded-md hover:z-10 focus:outline-none focus:border-indigo-600 focus:z-10 hover:bg-[#55acee] active:opacity-75 ${
                                index == categoryIndex ? "bg-[#55acee]" : ""
                            }`}
                            type="button"
                        >
                            {category}
                        </button>
                    ))}
                </div>

                {/* modified on https://www.hyperui.dev/components/marketing/sections */}

                <section>
                    <div className="px-4 py-16 mx-auto max-w-screen-xl sm:px-6 lg:px-8">
                        <div className="max-w-lg mx-auto text-center">
                            <h2 className="text-3xl font-bold sm:text-4xl">
                                Local most important information on Twitter
                            </h2>
                        </div>

                        <CategoryTwitters
                            ClassName="lg:hidden"
                            searchResults={searchResults}
                            categoryIndex={categoryIndex}
                        />

                        <CategoryTwitters
                            ClassName="hidden lg:grid"
                            searchResults={searchResults}
                            categoryIndex={0}
                        />

                        <CategoryTwitters
                            ClassName="hidden lg:grid"
                            searchResults={searchResults}
                            categoryIndex={1}
                        />

                        <CategoryTwitters
                            ClassName="hidden lg:grid"
                            searchResults={searchResults}
                            categoryIndex={2}
                        />

                        <div className="mt-12 text-center">
                            <a
                                onClick={onMore}
                                className="inline-flex items-center px-8 py-3 mt-8 text-white bg-pink-600 border border-pink-600 rounded hover:bg-transparent active:text-pink-500 focus:outline-none focus:ring"
                                href="#"
                            >
                                <span className="text-sm font-medium">
                                    Nur einmal mehr
                                </span>
                            </a>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}
