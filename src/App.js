import React, { useEffect, useRef, useState } from "react"; // Import necessary React hooks
import axios from "axios"; // Import Axios for making HTTP requests
import "./App.css"; // Import CSS styles for the component

const TOTAL_PAGES = 100; // Define the total number of pages for pagination

// Main App component
const App = () => {
  // State variables
  const [loading, setLoading] = useState(true); // Indicates if data is being loaded
  const [allUsers, setAllUsers] = useState([]); // Stores the fetched user data
  const [pageNum, setPageNum] = useState(1); // Current page number for pagination
  const [lastElement, setLastElement] = useState(null); // Reference to the last element for infinite scrolling
  const [selectedLanguage, setSelectedLanguage] = useState(""); // Holds the selected language for filtering

  // Create a ref for the intersection observer
  const observer = useRef(
    new IntersectionObserver((entries) => {
      const first = entries[0];
      // If the last element is intersecting, increment the page number
      if (first.isIntersecting) {
        setPageNum((no) => no + 1);
      }
    })
  );

  // Function to fetch user data from the API
  const callUser = async () => {
    setLoading(true); // Set loading state to true
    try {
      // Make a GET request to the API with pagination and language filter
      const response = await axios.get(
        `http://localhost:4000/items?page=${pageNum}&limit=30&language=${selectedLanguage}`
      );
      // Combine new users with existing users using a Set to avoid duplicates
      let all = new Set([...allUsers, ...response.data]);
      setAllUsers([...all]); // Update the state with combined users
    } catch (error) {
      console.error("Error fetching users:", error); // Log any errors
    } finally {
      setLoading(false); // Set loading state to false
    }
  };

  // useEffect to call the API when pageNum or selectedLanguage changes
  useEffect(() => {
    if (pageNum <= TOTAL_PAGES) {
      callUser(); // Fetch users if the current page is within limits
    }
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
          <p className="user-bio">{data.bio?.slice(0,50)}{'.'}</p>
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
            return i === allUsers.length - 1 && !loading && pageNum <= TOTAL_PAGES ? (
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