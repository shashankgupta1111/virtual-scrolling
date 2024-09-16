import React, { useEffect, useRef, useState } from "react";
import data from "./data.json";
import "./App.css";

const TOTAL_ITEMS_PER_PAGE = 30;

const App = () => {
  const [loading, setLoading] = useState(false);
  const [allUsers, setAllUsers] = useState([]);
  const [pageNum, setPageNum] = useState(0);
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [isTableView, setIsTableView] = useState(false);

  const cardLastElementRef = useRef(null);
  const tableLastElementRef = useRef(null);

  const getFilteredData = () => {
    return selectedLanguage
      ? data.filter((user) => user.language.toLowerCase() === selectedLanguage.toLowerCase())
      : data;
  };

  useEffect(() => {
    const filteredData = getFilteredData();
    const startIndex = (pageNum - 1) * TOTAL_ITEMS_PER_PAGE;
    const endIndex = startIndex + TOTAL_ITEMS_PER_PAGE;

    setAllUsers((prev) => [...prev, ...filteredData.slice(startIndex, endIndex)]);
  }, [pageNum, selectedLanguage]);

  useEffect(() => {
    const currentElement = isTableView ? tableLastElementRef.current : cardLastElementRef.current;
    const currentObserver = observer.current;

    if (currentElement) {
      currentObserver.observe(currentElement);
    }

    return () => {
      if (currentElement) {
        currentObserver.unobserve(currentElement);
      }
    };
  }, [isTableView, tableLastElementRef, cardLastElementRef]);

  const observer = useRef(
    new IntersectionObserver((entries) => {
      const first = entries[0];
      const filteredData = getFilteredData();

      if (first.isIntersecting && !loading && pageNum * TOTAL_ITEMS_PER_PAGE < filteredData.length) {
        setPageNum((no) => no + 1);
      }
    })
  );

  const handleLanguageChange = (event) => {
    setSelectedLanguage(event.target.value);
    setPageNum(1);
    setAllUsers([]);
  };

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

  const TableRow = ({ user, index }) => (
    <tr>
      <td>{index + 1}</td>
      <td>{user.name}</td>
      <td>{user.language}</td>
      <td>{user.id}</td>
      <td>{typeof user.version === 'string' ? user.version : JSON.stringify(user.version)}</td>
    </tr>
  );

  const toggleView = () => {
    setIsTableView((prev) => !prev);
  };

  return (
    <div className="app-container">
      <h1 className="app-title">All Users</h1>

      <div className="view-toggle-container">
        <button onClick={toggleView}>
          {isTableView ? "Switch Card View" : "Switch to Table View"}
        </button>
      </div>

      <div className="filter-container">
        <label htmlFor="language-filter">Filter by Language:</label>
        <select
          id="language-filter"
          value={selectedLanguage}
          onChange={handleLanguageChange}
        >
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

      {isTableView ? (
        <div className="table-responsive">
          <table className="user-table">
            <thead>
              <tr>
                <th>Item No</th>
                <th>Name</th>
                <th>Language</th>
                <th>ID</th>
                <th>Version</th>
              </tr>
            </thead>
            <tbody>
              {allUsers.length > 0 &&
                allUsers.map((user, i) => (
                  <TableRow key={`${user.id}-${i}`} user={user} index={i} />
                ))}
              <tr ref={tableLastElementRef}></tr>
            </tbody>
          </table>
        </div>
      ) : (
        <div className="user-grid">
          {allUsers.length > 0 &&
            allUsers.map((user, i) => {
              return i === allUsers.length - 1 && !loading ? (
                <div key={`${user.id}-${i}`}>
                  <UserCard data={user} index={i} />
                </div>
              ) : (
                <UserCard data={user} key={`${user.id}-${i}`} index={i} />
              );
            })}
            <div ref={cardLastElementRef} />
        </div>
      )}

      {loading && <p className="loading-text">Loading...</p>}
      {pageNum * TOTAL_ITEMS_PER_PAGE >= getFilteredData().length && <p className="end-message">? All users loaded ?</p>}
    </div>
  );
};

export default App;