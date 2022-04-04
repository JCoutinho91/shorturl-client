import { Link } from "react-router-dom";

import { useContext } from "react";
import { AuthContext } from "../../context/auth.context";

function Navbar() {
  //! Get the value from the context to handle the logOut button and the Welcome user
  const { isLoggedIn, user, logOutUser } = useContext(AuthContext);

  return (
    <nav className="Navbar">

      {isLoggedIn && (
        user && (
          <>
            <p style={{ color: "black", fontWeight: "bold", fontSize: "20px" }}>Welcome! {user.name}</p>
            <button onClick={logOutUser}>Logout</button>
          </>
        )
      )}

      {!isLoggedIn && (
        <>
          <Link to="/signup">
            <button>Sign Up</button>
          </Link>

          <Link to="/login">
            <button>Login</button>
          </Link>
        </>
      )}

    </nav>
  );
}

export default Navbar;
