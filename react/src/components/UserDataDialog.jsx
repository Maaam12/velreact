import PropTypes from "prop-types";

const UserDataDialog = ({ user, onClose }) => {
    return (
        <div className="user-dialog">
            <div className="card animated fadeInDown">
                <div className="card-header">
                    <h2>User Details</h2>
                    <button className="btn-close" onClick={onClose}>Close</button>
                </div>
                <div className="card-body">
                    <p>ID: {user.id}</p>
                    <p>Name: {user.name}</p>
                    <p>Email: {user.email}</p>
                    <p>Created At: {user.created_at}</p>
                    {/* Add more user details as needed */}
                </div>
            </div>
        </div>
    );
};

UserDataDialog.propTypes = {
    user: PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
        email: PropTypes.string.isRequired,
        created_at: PropTypes.string.isRequired,
    }).isRequired,
    onClose: PropTypes.func.isRequired,
};


export default UserDataDialog;
