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
        <div className="bg-gray-900 pb-32">
            <div className="px-4 pt-8 mx-auto max-w-screen-xl sm:px-6 lg:px-8">
                <div className="flex flex-row justify-start items-center bg-gray-700 rounded-full pl-4">
                    <img className="w-8 h-8" src="/twitter-48.png"></img>
                    {/* modified on https://www.hyperui.dev/components/application-ui/inputs */}

                    <form onSubmit={onSearch} className="relative w-full mr-6">
                        <input
                            className="w-full py-3 pl-3 pr-12 text-sm rounded bg-gray-700"
                            id="city"
                            value={searchTerm}
                            onChange={handelChange}
                            type="search"
                            placeholder="Stadt suchen"
                        />
                    </form>
                </div>
            </div>

            <main className="text-white bg-gray-900">
                {/* modified on https://www.hyperui.dev/components/application-ui/button-groups */}
                <div className="px-4 py-4 max-w-screen-xl flex justify-between items-center text-xs -space-x-px rounded-md lg:hidden">
                    {categories.map((category, index) => (
                        <button
                            key={category}
                            onClick={() => setCategoryIndex(index)}
                            className={`px-4 py-2 font-medium text-gray-400 bg-gray-700 rounded-full focus:outline-none focus:text-white-600 focus:z-10 active:opacity-75 ${
                                index == categoryIndex ? "bg-[#55acee]" : ""
                            } active:opacity-75 ${
                                index == categoryIndex ? "text-gray-900" : ""
                            }`}
                            type="button"
                        >
                            {category}
                        </button>
                    ))}
                </div>

                {/* modified on https://www.hyperui.dev/components/marketing/sections */}

                <section>
                    <div className="px-4 py-4 mx-auto max-w-screen-xl sm:px-6 lg:px-8">
                        <div className="max-w-lg mx-auto text-center">
                            <h2 className="text-2xl font-bold lg:text-4xl">
                                Wichtigste lokale Informationen auf Twitter
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

                        <div className="text-center">
                            <a
                                onClick={onMore}
                                className="inline-flex items-center px-8 py-3 mt-8 text-gray-400 bg-gray-700 rounded-full hover:bg-transparent active:bg-[#55acee] active:text-gray-900 focus:outline-none focus:ring"
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
