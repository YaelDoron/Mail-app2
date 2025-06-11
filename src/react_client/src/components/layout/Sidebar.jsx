import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchLabels, addLabel } from "../../services/labelsService";

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
            console.log("Label created:", created);
            setLabels((prev) => [...prev, created]);
            setNewLabelName("");
            setShowModal(false);
        } catch (err) {
            console.error("Failed to create label:", err);
                alert("יצירת התווית נכשלה – בדקי את הקונסול.");

        }
    };


    return (
    /* Compose new mail button */
        <div className="d-flex flex-column p-3 bg-light" style={{ width: "280px", height: "100vh" }}>

            <div className="d-flex align-items-center mb-4 px-2">
                <i className="bi bi-envelope-fill fs-4 text-primary me-2"></i>
                <span className="fw-bold fs-5 text-dark">MailApp</span>
            </div>

            <button className="btn text-dark bg-primary-subtle mb-3 w-100 rounded-4 py-2 text-start fw-bold shadow-sm">
                <i className="bi bi-pencil-fill me-3"></i> Compose
            </button>
                
            <ul className="nav nav-pills flex-column mb-auto">
                <li className="nav-item">
                    <Link to="/inbox" className="nav-link text-dark">
                        <i className="bi bi-inbox me-3"></i> Inbox
                    </Link>
                </li>
                <li>
                    <Link to="/starred" className="nav-link text-dark">
                        <i className="bi bi-star me-3"></i> Starred
                    </Link>
                </li>
                <li>
                <Link to="/sent" className="nav-link text-dark">
                    <i className="bi bi-send me-3"></i> Sent
                </Link>
                </li>
                <li>
                <Link to="/drafts" className="nav-link text-dark">
                    <i className="bi bi-file-earmark-text me-3"></i> Drafts
                </Link>
                </li>
                <li>
                <Link to="/allmail" className="nav-link text-dark">
                    <i className="bi bi-envelope-open me-3"></i> All mail
                </Link>
                </li>

                <li>
                    <Link to="/spam" className="nav-link text-dark">
                        <i className="bi bi-exclamation-octagon me-3"></i> Spam
                    </Link>
                </li>

                <li>
                <Link to="/garbage" className="nav-link text-dark">
                    <i className="bi bi-trash me-3"></i> garbage
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
                <div className="d-flex align-items-center justify-content-between px-3 mt-2 mb-1">
                    <span className="text-muted fw-bold">Labels</span>
                    <i
                        className="bi bi-plus-circle"
                        style={{ cursor: "pointer" }}
                        onClick={() => setShowModal(true)}
                    ></i>
                </div>


                {labels.map((label) => (
                    <li key={label.id}>
                    <Link to={`/labels/${label.name}`} className="nav-link text-dark">
                        <i className="bi bi-tag me-3"></i> {label.name}
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
                    top: 0, left: 0, right: 0, bottom: 0,
                    zIndex: 1050
                }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content p-4">
                            <h5 className="mb-3">New label</h5>

                            <label className="form-label">Please enter a new label name:</label>
                            <input
                            className="form-control mb-4"
                            placeholder="Label name"
                            value={newLabelName}
                            onChange={(e) => setNewLabelName(e.target.value)}
                            />

                            <div className="d-flex justify-content-end">
                                <button className="btn btn-link me-2" onClick={() => setShowModal(false)}>
                                    Cancel
                                </button>
                                <button
                                    className="btn btn-primary"
                                    disabled={!newLabelName.trim()}
                                    onClick={handleCreateLabel}
                                >
                                    Create
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default Sidebar;
