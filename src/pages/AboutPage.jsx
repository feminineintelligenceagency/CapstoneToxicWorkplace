import { useState } from "react";
import "../App.css";
import rolesData from "../types/RoleData";
import rolesDataCult from "../types/RoleDataCult";
import rolesDataFamily from "../types/RoleDataFamily";

import { BASE_SCENARIOS } from "../types/game";
import { CULT_SCENARIOS } from "../types/cultscenarios";
import { FAM_SCENARIOS } from "../types/familyscenarios";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";

import homepageImage from "../images/homepage.png";
import createlobbyImage from "../images/createlobby.png";

export default function About() {
      const [selectedRole, setSelectedRole] = useState({
        group: "base",
        key: "Micromanager"
    });
    const roles = Object.keys(rolesData);

    const [selectedScenario, setSelectedScenario] = useState(BASE_SCENARIOS[0]);

    const [activePanel, setActivePanel] = useState("role"); 

    const [openSection, setOpenSection] = useState(null);

    const toggleSection = (section) => {
        setOpenSection((prev) => (prev === section ? null : section));
    };

    const [openScenarioGroup, setOpenScenarioGroup] = useState(null);

    const toggleScenarioGroup = (groupId) => {
        setOpenScenarioGroup(prev => (prev === groupId ? null : groupId));
    };

    const [openRoleGroup, setOpenRoleGroup] = useState(null);
    const toggleRoleGroup = (groupId) => {
        setOpenRoleGroup(prev => (prev === groupId ? null : groupId));
    };

    const SCENARIO_GROUPS = [
        { id: "base", label: "Workplace", data: BASE_SCENARIOS },
        { id: "cult", label: "Cult", data: CULT_SCENARIOS },
        { id: "family", label: "Family", data: FAM_SCENARIOS },
    ];

    const ROLE_GROUPS = [
        { id: "base", label: "Workplace", data: rolesData },
        { id: "cult", label: "Cult", data: rolesDataCult },
        { id: "family", label: "Family", data: rolesDataFamily },
    ];

    const HOW_STEPS = [
        "Entering a Lobby",
        "Distribution of Roles",
        "Roleplay Phase",
        "Scoring Phase"
    ];

    const [selectedHowStep, setSelectedHowStep] = useState(0);

    const activeRoleData =
        selectedRole.group === "base"
            ? rolesData[selectedRole.key]
            : selectedRole.group === "cult"
                ? rolesDataCult[selectedRole.key]
                : rolesDataFamily[selectedRole.key];

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
                    style={{ cursor: "pointer",  fontFamily: "Poppins, sans-serif", fontWeight: "500"}}
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
                          style={{ cursor: "pointer", fontFamily: "Poppins, sans-serif", fontWeight: "500" }}
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
                          <ul className="text-lg" style={{ paddingLeft: "15px" }}>
                              {HOW_STEPS.map((step, index) => (
                                  <li
                                      key={index}
                                      style={{
                                          cursor: "pointer", fontFamily: "Poppins, sans-serif", 
                                          fontWeight: index === selectedHowStep ? "bold" : "normal",
                                      }}
                                      className={
                                          index === selectedHowStep
                                              ? "gradient-text-primary"
                                              : "text-muted-foreground"
                                      }
                                      onClick={() => {
                                          setSelectedHowStep(index);
                                          setActivePanel("how");
                                      }}
                                  >
                                      {step}
                                  </li>
                              ))}
                          </ul>
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
                          style={{ cursor: "pointer", fontFamily: "Poppins, sans-serif", fontWeight: "500" }}
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
                          <div>
                              {ROLE_GROUPS.map((group) => (
                                  <div key={group.id} style={{ marginBottom: "10px"}}>

                                      {/* Group Header */}
                                      <h3
                                          style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" }}
                                          className="text-md font-semibold"
                                          onClick={() => toggleRoleGroup(group.id)}
                                      >
                                          {group.label}
                                          <FontAwesomeIcon
                                              icon={faChevronDown}
                                              style={{
                                                  transform:
                                                      openRoleGroup === group.id
                                                          ? "rotate(0deg)"
                                                          : "rotate(90deg)",
                                                  transition: "transform 0.2s ease",
                                              }}
                                          />
                                      </h3>

                                      {/* Roles inside group */}
                                      {openRoleGroup === group.id && (
                                          <ul className="text-lg" style={{ paddingLeft: "15px" }}>
                                              {Object.keys(group.data).map((roleKey) => {
                                                  const role = group.data[roleKey];

                                                  return (
                                                      <li
                                                          key={roleKey}
                                                          style={{
                                                              cursor: "pointer", fontFamily: "Poppins, sans-serif",
                                                              fontWeight:
                                                                  roleKey === selectedRole.key && group.id === selectedRole.group
                                                                      ? "bold"
                                                                      : "normal",
                                                          }}
                                                          className={
                                                              roleKey === selectedRole.key && group.id === selectedRole.group
                                                                  ? "gradient-text-primary"
                                                                  : "text-muted-foreground"
                                                          }
                                                          onClick={() => {
                                                              setSelectedRole({ group: group.id, key: roleKey });
                                                              setActivePanel("role");
                                                          }}
                                                      >
                                                          {role.roleName}
                                                      </li>
                                                  );
                                              })}
                                          </ul>
                                      )}
                                  </div>
                              ))}
                          </div>
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
                          style={{ cursor: "pointer", fontFamily: "Poppins, sans-serif", fontWeight: "500" }}
                          className="text-lg"
                          onClick={() => toggleSection("scenarios")}
                      >
                          Scenarios

                          <FontAwesomeIcon icon={faChevronDown} style={{
                              transform: openSection === "scenarios" ? "rotate(0deg)" : "rotate(90deg)",
                              transition: "transform 0.2s ease",
                              padding: 0
                          }} />
                      </h2>

                      {openSection === "scenarios" && (
                          <div>
                              {SCENARIO_GROUPS.map((group) => (
                                  <div key={group.id} style={{ marginBottom: "10px" }}>
                                      {/* Group Header */}
                                      <h3
                                          style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" }}
                                          className="text-md font-semibold"
                                          onClick={() => toggleScenarioGroup(group.id)}
                                      >
                                          {group.label}
                                          <FontAwesomeIcon
                                              icon={faChevronDown}
                                              style={{
                                                  transform:
                                                      openScenarioGroup === group.id
                                                          ? "rotate(0deg)"
                                                          : "rotate(90deg)",
                                                  transition: "transform 0.2s ease",
                                              }}
                                          />
                                      </h3>

                                      {/* Scenarios inside group */}
                                      {openScenarioGroup === group.id && (
                                          <ul className="text-lg" style={{ paddingLeft: "15px" }}>
                                              {group.data.map((scenario) => (
                                                  <li
                                                      key={scenario.scenarioName}   // now this works
                                                      style={{
                                                          cursor: "pointer", fontFamily: "Poppins, sans-serif", 
                                                          fontWeight: scenario === selectedScenario ? "bold" : "normal",
                                                      }}
                                                      className={
                                                          scenario === selectedScenario
                                                              ? "gradient-text-primary"
                                                              : "text-muted-foreground"
                                                      }
                                                      onClick={() => {
                                                          setSelectedScenario(scenario);
                                                          setActivePanel("scenario");
                                                      }}
                                                  >
                                                      {scenario.scenarioName}  
                                                  </li>
                                              ))}
                                          </ul>
                                      )}
                                  </div>
                              ))}
                          </div>
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
                  {activePanel == "role" && activeRoleData  && (
                      <>
                          <h2 style={{ textAlign: "center", fontFamily: "Poppins, sans-serif", fontWeight: "500" }} className="text-2xl">
                              {activeRoleData.roleName}
                          </h2>
                          <h3 style={{ textAlign: "center", fontFamily: "Lato, sans-serif", fontWeight: "400" }} className="text-muted-foreground">
                              {" "}
                              A.K.A {activeRoleData.nickname}
                          </h3>

                          <h4 style={{ fontFamily: "Poppins, sans-serif", fontWeight: "500" }}>Description</h4>
                          <p className="text-muted-foreground" style={{ marginBottom: "20px", fontFamily: "Lato, sans-serif", fontWeight: "300" }}>
                              {activeRoleData.description}
                          </p>

                          <div style={{
                              display: "flex",
                              gap: "30px",
                              marginBottom: "30px"
                          }}>
                              <div style={{
                                  flex: 1,
                                  textAlign: "left",
                                  paddingLeft: "20px",
                                  gap: "30px"

                              }}>
                                  <h4 style={{ fontFamily: "Poppins, sans-serif", fontWeight: "500" }}>Always</h4>
                                  <ul
                                      className="text-muted-foreground"
                                      style={{ listStyleType: "disc", marginBottom: "20px", fontFamily: "Lato, sans-serif", fontWeight: "300" }}
                                  >
                                      {activeRoleData.always.map((item, index) => (
                                          <li key={index}>{item}</li>
                                      ))}
                                  </ul>
                              </div>

                              <div style={{
                                  flex: 1,
                                  textAlign: "left",
                                  paddingLeft: "20px",
                              }}>
                                  <h4 style={{ fontFamily: "Poppins, sans-serif", fontWeight: "500" }}>Never</h4>
                                  <ul
                                      className="text-muted-foreground"
                                      style={{ listStyleType: "disc", marginBottom: "20px", fontFamily: "Lato, sans-serif", fontWeight: "300" }}
                                  >
                                      {activeRoleData.never.map((item, index) => (
                                          <li key={index}>{item}</li>
                                      ))}
                                  </ul>
                              </div>
                          </div>


                          <h4 style={{ fontFamily: "Poppins, sans-serif", fontWeight: "500" }}>Objective</h4>
                          <p className="text-muted-foreground" style={{ marginBottom: "20px", fontFamily: "Lato, sans-serif", fontWeight: "300" }}>
                              {activeRoleData.objective}
                          </p>

                          <h4 style={{ fontFamily: "Poppins, sans-serif", fontWeight: "500" }}>Key Behaviors</h4>
                          <ul
                              className="text-muted-foreground"
                              style={{ listStyleType: "disc", marginBottom: "20px", fontFamily: "Lato, sans-serif", fontWeight: "300" }}
                          >
                              {activeRoleData.keyBehaviors.map((item, index) => (
                                  <li key={index}>{item}</li>
                              ))}
                          </ul>

                          <h4 style={{ fontFamily: "Poppins, sans-serif", fontWeight: "500" }}>Internal Rules</h4>
                          <ol className="text-muted-foreground" style={{ listStyleType: "disc", marginBottom: "20px", fontFamily: "Lato, sans-serif", fontWeight: "300" }}>
                              {activeRoleData.internalRules.map((item, index) => {
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

                          <h4 style={{ fontFamily: "Poppins, sans-serif", fontWeight: "500" }}>Impact on Team</h4>
                          <ul className="text-muted-foreground" style={{ listStyleType: "disc", marginBottom: "20px", fontFamily: "Lato, sans-serif", fontWeight: "300" }}>
                              {activeRoleData.teamImpact.map((item, index) => (
                                  <li key={index}>{item}</li>
                              ))}
                          </ul>

                          <h4 style={{ fontFamily: "Poppins, sans-serif", fontWeight: "500" }}>Motivation</h4>
                          <p className="text-muted-foreground" style={{ marginBottom: "20px", fontFamily: "Lato, sans-serif", fontWeight: "300" }}>
                              {activeRoleData.motivation}
                          </p>
                      </>
                  )}

                  {activePanel == "scenario" && (
                      <>
                          <h2 style={{ textAlign: "center", fontFamily: "Poppins, sans-serif", fontWeight: "500" }} className="text-2xl">
                              {selectedScenario.scenarioName}
                          </h2>

                          <h4 style={{ fontFamily: "Poppins, sans-serif", fontWeight: "500" }}>Scenario Seed</h4>
                          <p className="text-muted-foreground" style={{ marginBottom: "20px", fontFamily: "Lato, sans-serif", fontWeight: "300" }}>
                              {selectedScenario.scenarioSeed}
                          </p>

                          <h4 style={{ fontFamily: "Poppins, sans-serif", fontWeight: "500" }}>Description</h4>
                          <p className="text-muted-foreground" style={{ marginBottom: "20px", fontFamily: "Lato, sans-serif", fontWeight: "300" }}>
                              {selectedScenario.description}
                          </p>

                          <h4 style={{ fontFamily: "Poppins, sans-serif", fontWeight: "500" }} className="text-xl font-semibold">Available Roles</h4>

                          <ul>
                              {selectedScenario.roles.map((role, index) => (
                                  <li
                                      key={index}
                                      style={{
                                          padding: "12px 0",
                                          borderBottom: "1px solid #e0e0e0",
                                          fontFamily: "Lato, sans-serif", fontWeight: "400" 
                                      }}
                                  >
                                      <strong>{role.personality}</strong> — {role.roleName}
                                      <p style={{ fontFamily: "Lato, sans-serif", fontWeight: "300" }} className="text-muted-foreground text-sm">
                                          {role.roleDescription}
                                      </p>

                                      <p style={{ fontFamily: "Lato, sans-serif", fontWeight: "400" }} className="text-muted-foreground">Guidelines:</p>
                                      <ul className="text-muted-foreground" style={{ marginBottom: "20px", fontFamily: "Lato, sans-serif", fontWeight: "300" }}>
                                          {role.guidelines.map((item, index) => (
                                              <li key={index}>{item}</li>
                                          ))}
                                      </ul>
                                  </li>
                              ))}
                          </ul>
                      </>
                  )}

                  {activePanel === "how" && selectedHowStep === 0 && (
                      <>
                          <h2 style={{ textAlign: "center", marginBottom: "20px" }} className="text-2xl">
                              {HOW_STEPS[selectedHowStep]}
                          </h2>

                          <h3 style={{ textAlign: "center" }}> Home Page </h3>

                          <p className="text-muted-foreground" style={{ marginBottom: "20px" }}>
                              This is the homepage for the web app. Here you are able to easily navigate to all important features and information. At the top of the page, there is a banner
                              that can be used to see supplementaty information and return to this home page if needed:
                          </p>

                          <ul className="text-muted-foreground" style={{ listStyleType: "disc", marginBottom: "20px" }}>
                              <li>Play: Access the three main game modes as well as the roleplaying tutorial</li>
                              <li>About: View key background information about the webb</li>
                              <li>Tutorial: Learn how to more effectively roleplay to get the most out of your experience using the app</li>
                              <li>Contact: View the contact information for the Feminine Intelligence Agency</li>
                          </ul>

                          <p className="text-muted-foreground" style={{ marginBottom: "20px" }}>
                              Below the banner, you can see the three main gamemodes for the application (Toxic Workplace, Dysfunctional Family, and Cult Jam), as well as another way to access the roleplaying
                              tutorial menu. The general mechanics and gameplay flow will remain the same between modes, but the roles you act out and the scenarios you act in will change. 
                          </p>

                          <img
                              src={homepageImage}
                              alt="Homepage"
                              style={{ width: "100%", borderRadius: "10px" }}
                          />

                          <h3 style={{ textAlign: "center" }}> Lobby </h3>

                          <img
                              src={createlobbyImage}
                              alt="Homepage"
                              style={{ width: "100%", borderRadius: "10px" }}
                          />
                      </>
                  )}

                  {activePanel === "how" && selectedHowStep === 1 && (
                      <>
                          <h2 style={{ textAlign: "center" }} className="text-2xl">
                              {HOW_STEPS[selectedHowStep]}
                          </h2>

                          <p className="text-muted-foreground" style={{ marginTop: "20px" }}>
                              This is where you explain {HOW_STEPS[selectedHowStep]} in more detail.
                          </p>
                      </>
                  )}

                  {activePanel === "how" && selectedHowStep === 2 && (
                      <>
                          <h2 style={{ textAlign: "center" }} className="text-2xl">
                              {HOW_STEPS[selectedHowStep]}
                          </h2>

                          <p className="text-muted-foreground" style={{ marginTop: "20px" }}>
                              This is where you explain {HOW_STEPS[selectedHowStep]} in more detail.
                          </p>
                      </>
                  )}

                  {activePanel === "how" && selectedHowStep === 3 && (
                      <>
                          <h2 style={{ textAlign: "center" }} className="text-2xl">
                              {HOW_STEPS[selectedHowStep]}
                          </h2>

                          <p className="text-muted-foreground" style={{ marginTop: "20px" }}>
                              This is where you explain {HOW_STEPS[selectedHowStep]} in more detail.
                          </p>

                      </>
                  )}
        </div>
      </div>
    </div>
  );
}