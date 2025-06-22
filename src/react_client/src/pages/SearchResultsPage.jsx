import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; 
import MailList from "../components/mail/MailList";
import { getSearchMails } from "../services/mailsService";

// Page to display search results based on query in the URL
const SearchResultsPage = () => {
  const { query } = useParams(); 
  const [mails, setMails] = useState([]);

  useEffect(() => {
    // Fetch mails that match the search query
    const fetchSentMails = async () => {
      try {
        const data = await getSearchMails(query);
        setMails(data);
      } catch (err) {
        console.error("Failed to load Search results:", err);
      }
    };
    fetchSentMails();
  }, [query]);

  return (
    <div className="container p-3">
      {/* Page heading */}
      <h3>Search results</h3>
      {/* Display list of search result mails */}
      <MailList mails={mails} viewType="Search results" />
    </div>
  );
};

export default SearchResultsPage;
