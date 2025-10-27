import { Link } from "react-router-dom";

function Leftbar() {
    return (
        <>
            <div className="leftbar-item">
                <Link to="/">Home</Link>
            </div>
            <div className="leftbar-item">
                <Link to="/messages">Messages</Link>
            </div>
            <div className="leftbar-item">
                <Link to="/profile">Profile</Link>
            </div>
        </>
    )
};

export default Leftbar;