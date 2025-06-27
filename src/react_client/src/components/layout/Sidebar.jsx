import React, { useEffect, useState, useRef  } from "react";
import { Link } from "react-router-dom";
import { fetchLabels, addLabel, deleteLabel} from "../../services/labelsService";
import CreateLabelModal from "../mail/CreateLabelModal";
import { useLocation, useNavigate } from "react-router-dom";
import './Sidebar.css';
import EditLabelModal from "../mail/EditLabelModal";

const Sidebar = ({ onComposeClick }) => {
    // State to hold labels fetched from the server
    const [labels, setLabels] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const location = useLocation();
    const [editingLabel, setEditingLabel] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const menuRefs = useRef({});
    const editModalRef = useRef();
    const navigate = useNavigate();



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

    // Refresh labels whenever a "label-created" event is triggered globally
    useEffect(() => {
        const handleLabelCreated = async () => {
            const data = await fetchLabels();
            setLabels(data);
        };

        window.addEventListener("label-created", handleLabelCreated);
        return () => window.removeEventListener("label-created", handleLabelCreated);
    }, []);

    // Close dropdown when clicking outside menu or edit modal
    useEffect(() => {
        const handleClickOutside = (e) => {
            const clickedInsideMenu = Object.values(menuRefs.current).some(ref => ref?.contains(e.target));
            const clickedEditModal = editModalRef.current?.contains(e.target);

            if (!clickedInsideMenu && !clickedEditModal) {
            setEditingLabel(null);
            setShowEditModal(false);
            }
        };

        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, []);


const closeEditModal = () => {
  setShowEditModal(false);
  setEditingLabel(null);
};

  
    // Helper function to determine if a link is active
    const isActive = (path) => location.pathname === path;

    return (
    <div className="sidebar d-flex flex-column p-3 full-height">
        {/* compose button*/}
        <div className="compose-button-container">
            <button
                className="btn text-dark bg-primary-subtle mb-3 w-100 rounded-4 py-2 text-start fw-bold shadow-sm"
                onClick={onComposeClick}
            >
                <i className="bi bi-pencil-fill me-3"></i> Compose
            </button>
        </div>

        {/* Sidebar Links */}
        
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
                    className="nav-link d-flex justify-content-between align-items-center pointer"
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
                    <span className="label-title fw-bold">Labels</span>
                    <i
                        className="bi bi-plus-circle pointer"
                        onClick={() => setShowModal(true)}
                    ></i>
                </div>
            </li>
            {labels.map((label) => (
            <li className="nav-item d-flex justify-content-between align-items-center px-3" key={label.id}>
                <Link
                to={`/labels/${label.id}`}
                className={`nav-link p-0 flex-grow-1 ${location.pathname === `/labels/${label.id}` ? "active" : ""}`}
                >
                <i className="bi bi-tag me-2"></i> {label.name}
                </Link>
                <div className="position-relative" ref={(el) => (menuRefs.current[label.id] = el)}
>
                <i
                    className="bi bi-three-dots-vertical pointer"
                    onClick={() => setEditingLabel(label)}
                ></i>
                {editingLabel?.id === label.id && (
                    <div className="position-absolute bg-white border rounded shadow-sm p-2 small end-0 mt-2" style={{ zIndex: 999 }}>
                    <div className="dropdown-item pointer" onClick={() => {
                        setShowEditModal(true);
                    }}>Edit</div>
                    <div className="dropdown-item pointer text-danger" onClick={async () => {
                        await deleteLabel(label.id);
                        const refreshed = await fetchLabels();
                        setLabels(refreshed);
                        setEditingLabel(null);
                        if (location.pathname === `/labels/${label.id}`) {
                            navigate("/inbox");
                        }
                    }}>Remove Label</div>
                    </div>
                )}
                </div>
            </li>
            ))}

        </ul>


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

        {showEditModal && editingLabel && (
            <EditLabelModal
                ref={editModalRef}
                label={editingLabel}
                existingLabels={labels} 
                onClose={closeEditModal}
                onSave={async (updatedLabel) => {
                    const refreshed = await fetchLabels();
                    setLabels(refreshed);
                    closeEditModal();
                }}
            />

        )}

    </div>
);

};

export default Sidebar;
