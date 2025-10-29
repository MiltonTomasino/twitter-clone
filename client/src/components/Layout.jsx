import { Outlet } from "react-router-dom";
import "../styles/layout.css"
import Leftbar from "./Leftbar";
import Rightbar from "./Rightbar";

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
                    <Rightbar />
                </div>
            </div> 
        </div>
    )
};

export default Layout;