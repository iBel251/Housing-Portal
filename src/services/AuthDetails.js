import React, { useEffect, useState } from "react";
import { auth } from "./firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";

const AuthDetails = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const listen = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });
    return () => {
      listen();
    };
  }, []);

  const userSignout = () => {
    signOut(auth).then(() => {
      console.log("signed out successfully");
    });
  };
  return (
    <div>
      {user ? (
        <>
          <p>{`signed in as ${user.email}`}</p>
          <button onClick={userSignout}>signout</button>
        </>
      ) : (
        <p>Signed out</p>
      )}
    </div>
  );
};

export default AuthDetails;
