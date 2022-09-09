export default function CategoryTwitters({
    ClassName,
    searchResults,
    categoryIndex,
}) {
    return (
        <div
            className={`mt-8 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 ${ClassName}`}
        >
            {searchResults[categoryIndex]?.map((channel) => (
                <a
                    key={channel.id_str}
                    className="block p-8 border border-gray-800 shadow-xl transition rounded-xl hover:shadow-pink-500/10 hover:border-pink-500/10"
                    href={
                        "https://twitter.com/" +
                        channel.screen_name +
                        "/status/" +
                        channel.id_str
                    }
                    target="_blank"
                    rel="noreferrer"
                >
                    <h3 className="mt-4 text-xl font-bold text-white">
                        {channel.name} @{channel.screen_name}
                    </h3>
                    <p className="mt-1 text-sm text-gray-300">
                        {channel.full_text}
                    </p>
                    <p className="mt-1 text-sm text-gray-300">
                        {channel.created_at}
                    </p>
                </a>
            ))}
        </div>
    );
}
