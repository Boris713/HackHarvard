import { Link } from "react-router-dom";
import NavSelection from "./navSelection"; // Assuming NavSelection is your custom button component

export default function Sidebar() {
  return (
    <div className="d-flex flex-column bg-primary text-white vh-100" style={{ width: '250px', position: 'fixed', top: '0', left: '0' }}>
      <NavSelection>
        <Link to="/environmental" className="nav-link text-white text-center py-3">Env</Link>
      </NavSelection>
      <NavSelection>
        <Link to="/social" className="nav-link text-white text-center py-3">Soc</Link>
      </NavSelection>
      <NavSelection>
        <Link to="/governance" className="nav-link text-white text-center py-3">Gov</Link>
      </NavSelection>
    </div>
  );
}
