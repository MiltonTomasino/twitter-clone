import { Outlet } from "react-router-dom";
import "../styles/home.css"
import Leftbar from "./Leftbar";

function Layout() {

    return (
        <div className="home-page">
            <div className="content">
                <div className="leftbar">
                    <Leftbar />
                </div>

                <div className="main">
                    <Outlet />
                </div>

                <div className="rightbar">

                </div>
            </div> 
        </div>
    )
};

export default Layout;