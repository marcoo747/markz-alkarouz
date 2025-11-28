import React from "react";
import "../styles/requests.css";
import NavBar from "../Components/NavBar";

const Requests = () => {
  return (
    <div>
      <NavBar />
      <div className="requests-container">
        <div className="requests-content">
          <h1>Requests Page</h1>
          <p>This is where user requests will be displayed.</p>
        </div>
      </div>
    </div>
  );
};

export default Requests;
