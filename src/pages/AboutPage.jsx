import { useState } from "react";
import "../App.css";
import rolesData from "../types/RoleData";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";

export default function About() {
  const [selectedRole, setSelectedRole] = useState("Micromanager");
    const roles = Object.keys(rolesData);

    const [openSection, setOpenSection] = useState(null);

    const toggleSection = (section) => {
        setOpenSection((prev) => (prev === section ? null : section));
    };

  return (
    <div
      style={{
        width: "100%",
        lineHeight: "1.6",
        textAlign: "left",
        marginTop: "20px",
      }}
    >
      <h2
        style={{
          padding: "50px",
          textAlign: "center",
        }}
        className="text-5xl font-bold gradient-text-primary"
      >
        About This Game
      </h2>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: "40px",
          alignItems: "flex-start",
        }}
      >
        <div style={{ flex: 0.35, textAlign: "left", marginRight: "15px" }}>
                <div
                    style={{
                        border: "1px solid #ccc",
                        borderRadius: "8px",
                        padding: "15px",
                        backgroundColor: "#f9f9f9",
                          boxShadow: "0 2px 5px rgba(0,0,0,0.1)", 
                    }}
                >
                <h2
                    style={{ cursor: "pointer" }}
                    className="text-lg"
                    onClick={() => toggleSection("purpose")}
                      >
                          Purpose

                          <FontAwesomeIcon icon={faChevronDown} style={{
                              transform: openSection === "purpose" ? "rotate(0deg)" : "rotate(90deg)",
                              transition: "transform 0.2s ease",
                              padding: 0
                          }} />
                      </h2>


                {openSection === "purpose" && (
                    <p className="text-muted-foreground text-lg">
                        Toxic Workplace Simulator is web application designed to help people
                        suffering from workplace harrassment and discrimination to learn how
                        to deal with those situations in a safe and healthy way.
                    </p>
                )}
            </div>

                <div
                    style={{
                        border: "1px solid #ccc",
                        borderRadius: "8px",
                        padding: "15px",
                        backgroundColor: "#f9f9f9",
                        boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                    }}
                >
                <h2
                    style={{ cursor: "pointer" }}
                    className="text-lg"
                    onClick={() => toggleSection("how")}
                >
                          How to Play 

                    <FontAwesomeIcon icon={faChevronDown} style={{
                        transform: openSection === "how" ? "rotate(0deg)" : "rotate(90deg)",
                        transition: "transform 0.2s ease",
                        padding: 0
                    }} />
                </h2>

                {openSection === "how" && (
                    <p className="text-muted-foreground text-lg">
                        Each player is assigned one of the 15 roles. This role is visible
                        only to you and no other players. Based on the given description,
                        the players must act out their roles and roleplay a given workplace
                        scenario. At the end of the game, each player will be prompted to
                        guess the role of each player in the lobby besides themselves.
                    </p>
                )}
            </div>

                <div
                    style={{
                        border: "1px solid #ccc",
                        borderRadius: "8px",
                        padding: "15px",
                        backgroundColor: "#f9f9f9",
                        boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                    }}
                >
                <h2
                    style={{ cursor: "pointer" }}
                    className="text-lg"
                    onClick={() => toggleSection("roles")}
                >
                    Roles 

                    <FontAwesomeIcon icon={faChevronDown} style={{
                        transform: openSection === "roles" ? "rotate(0deg)" : "rotate(90deg)",
                        transition: "transform 0.2s ease",
                        padding: 0
                    }} />
                </h2>

                {openSection === "roles" && (
                    <ul className="text-lg">
                        {roles.map((role) => (
                            <li
                                key={role}
                                style={{
                                    cursor: "pointer",
                                    fontWeight: role === selectedRole ? "bold" : "normal",
                                }}
                                className={
                                    role === selectedRole
                                        ? "gradient-text-primary"
                                        : "text-muted-foreground"
                                }
                                onClick={() => setSelectedRole(role)}
                            >
                                {rolesData[role].roleName}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>

        <div
          style={{
            flex: 1,
            textAlign: "left",
            marginRight: "20px",
            borderLeft: "2px solid #ccc",
            paddingLeft: "30px",
          }}
          className="text-lg"
        >
          <h2 style={{ textAlign: "center" }} className="text-2xl">
            {rolesData[selectedRole].roleName}
          </h2>
          <h3 style={{ textAlign: "center" }} className="text-muted-foreground">
            {" "}
            A.K.A {rolesData[selectedRole].nickname}
          </h3>

            <h4>Description</h4>
           <p className="text-muted-foreground" style={{ marginBottom: "20px" }}>
            {rolesData[selectedRole].description}
          </p>

          <h4>Key Behaviors</h4>
          <ul
            className="text-muted-foreground"
            style={{ listStyleType: "disc", marginBottom: "20px" }}
          >
            {rolesData[selectedRole].keyBehaviors.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>

        <h4>Internal Rules</h4>
          <ol className="text-muted-foreground" style={{ listStyleType: "disc", marginBottom: "20px" }}>
            {rolesData[selectedRole].internalRules.map((item, index) => {
              const [title, rest] = item.split(":");
              return (
                <li key={index}>
                  <span
                    style={{ textDecoration: "underline", fontWeight: "bold" }}
                  >
                    {title}:
                  </span>
                  {rest}
                </li>
              );
            })}
          </ol>

         <h4>Impact on Team</h4>
          <ul className="text-muted-foreground" style={{ listStyleType: "disc", marginBottom: "20px" }}>
            {rolesData[selectedRole].teamImpact.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>

        <h4>Motivation</h4>
          <p className="text-muted-foreground" style={{ marginBottom: "20px" }}>
            {rolesData[selectedRole].motivation}
          </p>
        </div>
      </div>
    </div>
  );
}