import "../styles/Homepage.css";
import NavBar from "../components/NavBar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import type {navigationTypes} from '../utils/types'
import { useNavigate } from "react-router";

// import { getAuth } from "firebase/auth";
// import { auth } from "../../../backend/index"



const Homepage = ( {navOpen, toggleNav} : navigationTypes) => {

  // const user = auth.currentUser;
  const navigate = useNavigate();

  // if (user) {
  //   // User is signed in, see docs for a list of available properties
  //   // https://firebase.google.com/docs/reference/js/auth.user
  //   // ...
  //   console.log("user is signed in: ", user);
  // } else {
  //   // No user is signed in.
  //   console.log("no user signed in")
  // }

  return (
    <div>
      <button onClick={() => navigate("/login")}>Login</button>
      <button onClick={toggleNav}>
        <FontAwesomeIcon
          icon={faBars}
          className="nav-icon"
        />
      </button>
      {navOpen && <NavBar toggleNav={toggleNav} />}
      Homepage
    </div>
  );
};

export default Homepage;
