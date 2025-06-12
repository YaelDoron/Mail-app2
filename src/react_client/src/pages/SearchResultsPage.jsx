import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; 
import MailList from "../components/mail/MailList";
import { getSearchMails } from "../services/mailsService";

const SearchResultsPage = () => {
  const { query } = useParams(); 
  const [mails, setMails] = useState([]);

  useEffect(() => {
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
      <h3>Search results</h3>
      <MailList mails={mails} viewType="Search results" />
    </div>
  );
};

export default SearchResultsPage;
