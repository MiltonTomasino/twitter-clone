import { Link } from "react-router-dom";

function Leftbar() {
    return (
        <>
            
            <Link className="leftbar-item" to="/">Home</Link>
            
            
            <Link className="leftbar-item" to="/messages">Messages</Link>
            
            
            <Link className="leftbar-item" to="/notifications">Notifications</Link>
            
            
            <Link className="leftbar-item" to="/profile">Profile</Link>
            
        </>
    )
};

export default Leftbar;