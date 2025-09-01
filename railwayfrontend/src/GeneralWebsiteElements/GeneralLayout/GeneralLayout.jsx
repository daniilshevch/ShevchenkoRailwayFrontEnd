import { Outlet } from 'react-router-dom';
import Navbar from "../Navbar/Navbar.jsx";
function GeneralLayout()
{
    return (
        <>
            <Navbar />
            <main className="main-content">
                <Outlet />
            </main>
        </>
    )
}
export default GeneralLayout;