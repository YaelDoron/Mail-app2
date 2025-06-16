import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchLabels, addLabel } from "../../services/labelsService";
import CreateLabelModal from "../mail/CreateLabelModal";
import { useLocation } from "react-router-dom";
import './Sidebar.css';

const Sidebar = ({ onComposeClick }) => {
    // State to hold labels fetched from the server
    const [labels, setLabels] = useState([]);
    // State to hold 
    const [showModal, setShowModal] = useState(false);
    const location = useLocation();

    // Fetch labels once when the component mounts
    useEffect(() => {
        const getLabels = async () => {
            try {
                const data = await fetchLabels(); // API call to get labels
                setLabels(data);// Store labels in state
            } 
            catch (err) {
                console.error("Failed to fetch labels:", err);
            }
        };
        getLabels();
    }, []);

    useEffect(() => {
        const handleLabelCreated = async () => {
            const data = await fetchLabels();
            setLabels(data);
        };

        window.addEventListener("label-created", handleLabelCreated);
        return () => window.removeEventListener("label-created", handleLabelCreated);
    }, []);

    const isActive = (path) => location.pathname === path;

    return (
    <div className="d-flex flex-column p-3 bg-light" style={{ width: "280px", height: "100vh" }}>
        {/* compose button*/}
        <div style={{ width: "75%", minWidth: "200px" }}>
            <button
                className="btn text-dark bg-primary-subtle mb-3 w-100 rounded-4 py-2 text-start fw-bold shadow-sm"
                onClick={onComposeClick}
            >
                <i className="bi bi-pencil-fill me-3"></i> Compose
            </button>
        </div>

        {/* Sidebar Links */}
        <div style={{ overflowY: "auto", flexGrow: 1 }}>
            <ul className="nav nav-pills flex-column mb-auto">
                <li className="nav-item">
                    <Link to="/inbox" className={`nav-link ${isActive("/inbox") ? "active" : ""}`}>
                        <i className="bi bi-inbox me-3"></i> Inbox
                    </Link>
                </li>
                <li>
                    <Link to="/starred" className={`nav-link ${isActive("/starred") ? "active" : ""}`}>
                        <i className="bi bi-star me-3"></i> Starred
                    </Link>
                </li>
                <li>
                    <Link to="/sent" className={`nav-link ${isActive("/sent") ? "active" : ""}`}>
                        <i className="bi bi-send me-3"></i> Sent
                    </Link>
                </li>
                <li>
                    <Link to="/drafts" className={`nav-link ${isActive("/drafts") ? "active" : ""}`}>
                        <i className="bi bi-file-earmark-text me-3"></i> Drafts
                    </Link>
                </li>
                <li>
                    <Link to="/AllMails" className={`nav-link ${isActive("/AllMails") ? "active" : ""}`}>
                        <i className="bi bi-envelope-open me-3"></i> All mail
                    </Link>
                </li>
                <li>
                    <Link to="/spam" className={`nav-link ${isActive("/spam") ? "active" : ""}`}>
                        <i className="bi bi-exclamation-octagon me-3"></i> Spam
                    </Link>
                </li>
                <li>
                    <Link to="/trash" className={`nav-link ${isActive("/trash") ? "active" : ""}`}>
                        <i className="bi bi-trash me-3"></i> Trash
                    </Link>
                </li>
                {/* Shortcut to open label creation modal */}
                <li>
                    <span
                        className="nav-link d-flex justify-content-between align-items-center text-dark"
                        style={{ cursor: "pointer" }}
                        onClick={() => setShowModal(true)}
                    >
                        New label
                        <i className="bi bi-plus-circle"></i>
                    </span>
                </li>
                {/* Label section title with plus icon */}
                <hr />
                <li className="nav-item">
                    <div className="d-flex align-items-center justify-content-between px-3 mt-2 mb-1">
                        <span className="text-muted fw-bold">Labels</span>
                        <i
                            className="bi bi-plus-circle"
                            style={{ cursor: "pointer" }}
                            onClick={() => setShowModal(true)}
                        ></i>
                    </div>
                </li>
                {labels.map((label) => (
                    <li className="nav-item" key={label.id}>
                        <Link to={`/labels/${label.id}`} className={`nav-link ${location.pathname === `/labels/${label.id}` ? "active" : ""}`}>
                        <i className="bi bi-tag me-3"></i> {label.name}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>

        {/* Modal for label creation */}
        {showModal && (
            <CreateLabelModal
                onClose={() => setShowModal(false)}
                onCreate={async (name) => {
                await addLabel({ name });
                const refreshed = await fetchLabels();
                setLabels(refreshed);
                setShowModal(false);
                }}
                existingLabels={labels}
            />
        )}
    </div>
);

};

export default Sidebar;
