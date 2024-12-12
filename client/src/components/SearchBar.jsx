
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "./Navbar";

const SearchBar = () => {
  const location = useLocation();
  const [heading, setHeading] = useState("Search");

  useEffect(() => {
    // Check if state was passed during navigation
    if (location.state && location.state.heading) {
      setHeading(location.state.heading);
    }
  }, [location]);

  return (
    <div>
      <Navbar />
      <div className="p-8 bg-gray-100 min-h-screen">
        {/* Page Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-blue-900">{heading}</h1>
          <p className="text-gray-600 mt-2">
            Use the filters below to refine your search.
          </p>
        </div>

        {/* Search Bar */}
        <div className="flex justify-center">
          <div className="w-full max-w-3xl">
            <div className="flex items-center bg-white shadow-md rounded-lg overflow-hidden">
              <input
                type="text"
                className="w-full p-4 text-gray-700 focus:outline-none"
                placeholder={`Search ${heading}...`}
              />
              <button className="bg-blue-600 text-white px-8 py-4 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
                Search
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;