import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <div className="container mx-auto py-4">
      <div className="header flex items-center justify-between">
        <h3 className="font-medium text-lg">Ming: Welcome Home! 👋</h3>
        <div className="flex items-center gap-2">
          <div className="inputContainer flex items-center gap-2 border-b-gray-500 border-b-2">
            <i className="ri-search-line"></i>
            <input
              type="text"
              className="bg-transparent focus:outline-none text-sm"
              placeholder="Search Projects..."
            />
          </div>
          <button className="flex items-center gap-1 bg-[#00fe66c0] px-2 py-1 text-sm"><i className="ri-link"></i> Add new</button>
        </div>
      </div>
    </div>
  );
}
