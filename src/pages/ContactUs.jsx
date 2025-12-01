import { useState } from "react";
import "../App.css";

export default function Contact() {
  return (
    <div style={{ marginTop: "10px" }}>
      <h2
        style={{
          padding: "20px",
          textAlign: "center",
          textDecoration: "underline",
        }}
        className="text-5xl font-bold gradient-text-primary"
      >
        How to Contact Us
      </h2>
      <p>Lauren Nignon: lauren.nignon@gmail.com</p>
    </div>
  );
}
