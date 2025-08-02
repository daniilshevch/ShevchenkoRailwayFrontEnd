import { Outlet } from 'react-router-dom';
import Navbar from "../components/Navbar";
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