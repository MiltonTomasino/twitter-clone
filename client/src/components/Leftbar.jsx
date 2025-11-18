import { Link } from "react-router-dom";

function Leftbar() {
    return (
        <div>
            <div className="leftbar-item">
                <Link to="/">Home</Link>
            </div>
            <div className="leftbar-item">
                <Link to="/messages">Messages</Link>
            </div>
            <div className="leftbar-item">
                <Link to="/notifications">Notifications</Link>
            </div>
            <div className="leftbar-item">
                <Link to="/profile">Profile</Link>
            </div>
        </div>
    )
};

export default Leftbar;