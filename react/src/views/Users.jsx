import { useEffect, useState, useRef } from "react";
import axiosClient from "../axios-client.js";
import { Link } from "react-router-dom";
import { useStateContext } from "../context/ContextProvider.jsx";
import showIcon from "../assets/icons/file.png";
import editIcon from "../assets/icons/edit.png";
import binIcon from "../assets/icons/bin.png";
import UserDataDialog from "../components/UserDataDialog.jsx";

export default function Users() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [inputPage, setInputPage] = useState(currentPage);
    const [isInputValid, setIsInputValid] = useState(true);
    const [totalPages, setTotalPages] = useState(1); // New state for total pages
    const { setNotification } = useStateContext();
    const dialogRef = useRef(null);

    useEffect(() => {
        getUsers();
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [currentPage]);

    useEffect(() => {
        validateInputPage();
    }, [inputPage, totalPages]); // Trigger input validation when inputPage or totalPages changes

    const getUsers = () => {
        setLoading(true);
        axiosClient
            .get(`/users?page=${currentPage}`)
            .then(({ data }) => {
                setLoading(false);
                setUsers(data.data);
                setTotalPages(data.meta.last_page); // Set total pages from API response
            })
            .catch(() => {
                setLoading(false);
            });
    };

    const onShowDetailsClick = (user) => {
        setSelectedUser(user);
    };

    const onCloseDialog = () => {
        setSelectedUser(null);
    };

    const onDeleteClick = (user) => {
        if (!window.confirm("Are you sure you want to delete this user?")) {
            return;
        }
        axiosClient
            .delete(`/users/${user.id}`)
            .then(() => {
                setNotification("User was successfully deleted");
                getUsers();
            })
            .catch((error) => {
                console.error("Error deleting user:", error);
            });
    };

    const handleClickOutside = (event) => {
        if (dialogRef.current && !dialogRef.current.contains(event.target)) {
            onCloseDialog();
        }
    };

    const onPageChange = (page) => {
        setCurrentPage(page);
        setInputPage(page);
    };

    const handleInputChange = (e) => {
        setInputPage(e.target.value);
    };

    const validateInputPage = () => {
        const pageNumber = parseInt(inputPage);
        setIsInputValid(pageNumber > 0 && pageNumber <= totalPages);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            if (isInputValid) {
                onPageChange(parseInt(inputPage));
            }
        }
    };

    const handleNextPage = () => {
        onPageChange(currentPage + 1);
    };

    const handlePreviousPage = () => {
        onPageChange(currentPage - 1);
    };

    return (
        <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h1>Users</h1>
                <Link className="btn-add" to="/users/new">
                    Add new
                </Link>
            </div>
            <div className="card animated fadeInDown">
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Create Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    {loading && (
                        <tbody>
                            <tr>    
                                <td colSpan="5" className="text-center">
                                    Loading...
                                </td>
                            </tr>
                        </tbody>
                    )}
                    {!loading && (
                        <tbody>
                            {users.map((u) => (
                                <tr key={u.id}>
                                    <td>{u.id}</td>
                                    <td>{u.name}</td>
                                    <td>{u.email}</td>
                                    <td>{u.created_at}</td>
                                    <td>
                                        <span onClick={() => onShowDetailsClick(u)}>
                                            <img src={showIcon} alt="Show" className="btn-img" />
                                        </span>
                                        <Link to={"/users/" + u.id}>
                                            <img src={editIcon} alt="Edit" className="btn-img" />
                                        </Link>
                                        &nbsp;
                                        <span onClick={() => onDeleteClick(u)}>
                                            <img src={binIcon} alt="Delete" className="btn-img " />
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    )}
                </table>
                <div className="pagination">
                    <button onClick={handlePreviousPage} disabled={currentPage === 1}>
                        Previous
                    </button>
                    <div>
                        <input
                            type="number"
                            min="1"
                            value={inputPage}
                            onChange={handleInputChange}
                            onKeyPress={handleKeyPress}
                            className={!isInputValid ? "invalid-input" : ""}
                        />
                    </div>
                    <button onClick={handleNextPage} disabled={currentPage === totalPages}>
                        Next
                    </button>
                </div>
                {selectedUser && (
                    <div ref={dialogRef}>
                        <UserDataDialog user={selectedUser} onClose={onCloseDialog} />
                    </div>
                )}
            </div>
        </div>
    );
}
