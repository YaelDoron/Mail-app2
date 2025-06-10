import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchLabels, addLabel } from "../services/labelsService";

const Sidebar = () => {
    // State to hold labels fetched from the server
    const [labels, setLabels] = useState([]);
    // State to hold 
    const [showModal, setShowModal] = useState(false);
    const [newLabelName, setNewLabelName] = useState("");

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


    // Handle creating a new label
    const handleCreateLabel = async () => {
        if (!newLabelName.trim()) return;
        try {
            const created = await addLabel({ name: newLabelName });
            setLabels((prev) => [...prev, created]);
            setNewLabelName("");
            setShowModal(false);
        } catch (err) {
        console.error("Failed to create label:", err);
    }
  };


    return (
    /* Compose new mail button */
        <div className="d-flex flex-column p-3 bg-light" style={{ width: "280px", height: "100vh" }}>
            <button className="btn btn-primary mb-3 w-100 rounded-pill fw-bold">
                <i className="bi bi-pencil me-2"></i> New Mail
            </button>
                
            <ul className="nav nav-pills flex-column mb-auto">
                <li className="nav-item">
                    <Link to="/inbox" className="nav-link text-dark">
                        <i className="bi bi-inbox me-2"></i> Inbox
                    </Link>
                </li>
                <li>
                    <Link to="/starred" className="nav-link text-dark">
                        <i className="bi bi-star me-2"></i> Starred
                    </Link>
                </li>
                <li>
                <Link to="/sent" className="nav-link text-dark">
                    <i className="bi bi-send me-2"></i> Sent
                </Link>
                </li>
                <li>
                <Link to="/drafts" className="nav-link text-dark">
                    <i className="bi bi-file-earmark-text me-2"></i> Drafts
                </Link>
                </li>
                <li>
                <Link to="/allmail" className="nav-link text-dark">
                    <i className="bi bi-envelope-open me-2"></i> All mail
                </Link>
                </li>

                <li>
                    <Link to="/spam" className="nav-link text-dark">
                        <i className="bi bi-exclamation-octagon me-2"></i> Spam
                    </Link>
                </li>

                <li>
                <Link to="/garbage" className="nav-link text-dark">
                    <i className="bi bi-trash me-2"></i> garbage
                </Link>
                </li>

                {/* Placeholder for creating a new label*/}
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

                <hr />
                <li className="nav-item">
                <strong className="ms-2 text-muted">Labels</strong>
                {labels.map((label) => (
                    <li key={label.id}>
                    <Link to={`/labels/${label.name}`} className="nav-link text-dark">
                        <i className="bi bi-tag me-2"></i> {label.name}
                    </Link>
                    </li>
                ))}
                </li>
            </ul>
            
            {/* Modal for label creation */}
            {showModal && (
                <div className="modal d-block" tabIndex="-1" style={{
                background: "rgba(0, 0, 0, 0.5)",
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0
                }}>
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content p-3">
                    <h5>New Label</h5>
                    <input
                        className="form-control mb-2"
                        placeholder="Enter label name"
                        value={newLabelName}
                        onChange={(e) => setNewLabelName(e.target.value)}
                    />
                    <div className="d-flex justify-content-end gap-2">
                        <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                        <button className="btn btn-primary" onClick={handleCreateLabel}>Create</button>
                    </div>
                    </div>
                </div>
                </div>
            )}
            </div>
        );
    };

export default Sidebar;
