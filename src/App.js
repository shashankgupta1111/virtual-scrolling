import React, { useEffect, useRef, useState } from "react"; // Import necessary React hooks
import data from "./data.json"; // Import the JSON data directly
import "./App.css"; // Import CSS styles for the component

const TOTAL_PAGES = Math.ceil(data.length / 30); // Calculate total pages based on data length and limit

// Main App component
const App = () => {
  // State variables
  const [loading, setLoading] = useState(false); // Indicates if data is being loaded
  const [allUsers, setAllUsers] = useState([]); // Stores the fetched user data
  const [pageNum, setPageNum] = useState(1); // Current page number for pagination
  const [lastElement, setLastElement] = useState(null); // Reference to the last element for infinite scrolling
  const [selectedLanguage, setSelectedLanguage] = useState(""); // Holds the selected language for filtering

  // Function to filter and paginate user data
  const getFilteredData = () => {
    // Filter the data based on selected language
    const filteredData = selectedLanguage
      ? data.filter(user => user.language.toLowerCase() === selectedLanguage.toLowerCase())
      : data;

    // Calculate pagination
    const limit = 30; // Define the limit per page
    const startIndex = (pageNum - 1) * limit; // Calculate the starting index
    const endIndex = startIndex + limit; // Calculate the ending index

    return filteredData.slice(startIndex, endIndex); // Return the sliced data
  };

  // useEffect to update users based on page number and selected language
  useEffect(() => {
    setLoading(true); // Set loading state to true
    const users = getFilteredData(); // Get filtered and paginated data
    setAllUsers((prev) => [...prev, ...users]); // Append new users to existing users
    setLoading(false); // Set loading state to false
  }, [pageNum, selectedLanguage]);

  // useEffect to observe the last element for infinite scrolling
  useEffect(() => {
    const currentElement = lastElement; // Get the last element reference
    const currentObserver = observer.current; // Get the current observer

    if (currentElement) {
      currentObserver.observe(currentElement); // Start observing the last element
    }

    // Cleanup function to unobserve the last element
    return () => {
      if (currentElement) {
        currentObserver.unobserve(currentElement);
      }
    };
  }, [lastElement]);

  // Create a ref for the intersection observer
  const observer = useRef(
    new IntersectionObserver((entries) => {
      const first = entries[0];
      // If the last element is intersecting, increment the page number
      if (first.isIntersecting && !loading && pageNum < TOTAL_PAGES) {
        setPageNum((no) => no + 1); // Increment page number only if conditions are met
      }
    })
  );

  // Function to handle language selection change
  const handleLanguageChange = (event) => {
    setSelectedLanguage(event.target.value); // Update selected language
    setPageNum(1); // Reset page number to 1
    setAllUsers([]); // Clear existing users to fetch new data based on the new filter
  };

  // UserCard component to display individual user information
  const UserCard = ({ data, index }) => {
    return (
      <div className="user-card">
        <div className="user-card-header">
          <h2 className="user-name">{data.name}</h2>
          <p className="user-language">Language: {data.language}</p>
        </div>
        <div className="user-card-body">
          <p className="user-id">ID: {data.id}</p>
          <p className="user-bio">{data.bio?.slice(0, 50)}{'.'}</p>
        </div>
        <div className="user-card-footer">
          <p className="user-version">Version: {data.version}</p>
         <p className="user-version">Item No: {index + 1}</p>
        </div>
      </div>
    );
  };

  // Render the main application UI
  return (
    <div className="app-container">
      <h1 className="app-title">All Users</h1>

      <div className="filter-container">
        <label htmlFor="language-filter">Filter by Language:</label>
        <select
          id="language-filter"
          value={selectedLanguage}
          onChange={handleLanguageChange}
        >
          {/* Language selection options */}
          <option value="">All Languages</option>
          <option value="Icelandic">Icelandic</option>
          <option value="Hindi">Hindi</option>
          <option value="Setswana">Setswana</option>
          <option value="isiZulu">isiZulu</option>
          <option value="Bosnian">Bosnian</option>
          <option value="Sindhi">Sindhi</option>
          <option value="Uyghur">Uyghur</option>
          <option value="Galician">Galician</option>
          <option value="Maltese">Maltese</option>
          <option value="Sesotho sa Leboa">Sesotho sa Leboa</option>
        </select>
      </div>

      <div className="user-grid">
        {/* Map through all users and render UserCard components */}
        {allUsers.length > 0 &&
          allUsers.map((user, i) => {
            return i === allUsers.length - 1 && !loading ? (
              <div key={`${user.id}-${i}`} ref={setLastElement}>
                <UserCard data={user} index={i} />
              </div>
            ) : (
              <UserCard data={user} key={`${user.id}-${i}`} index={i} />
            );
          })}
      </div>
      {loading && <p className="loading-text">Loading...</p>} {/* Loading text */}

      {pageNum - 1 === TOTAL_PAGES && (
        <p className="end-message">? All users loaded ?</p> // Message indicating all users have been loaded
      )}
    </div>
  );
};

export default App; // Export the App component