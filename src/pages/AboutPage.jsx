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
import assetmanagerImage from "../images/assetmanager.png";
import scenariomanagerImage from "../images/scenariomanager.png";
import createlobbyImage from "../images/createlobby.png";
import hostlobbyImage from "../images/hostlobby.png";
import lobbysettingsImage from "../images/lobbysettings.png";
import joinlobbyImage from "../images/joinlobby.png";
import playerlobbyImage from "../images/playerlobby.png";
import roleselectImage from "../images/roleselect.png";
import rolerevealImage from "../images/rolereveal.png";
import roleplayphaseImage from "../images/roleplayphase.png";
import roleplayassetsImage from "../images/roleplayassets.png";
import roleplayinfoImage from "../images/roleplayinfo.png";
import roleguessImage from "../images/roleguess.png";
import resultsImage from "../images/finalresults.png";

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
        "Home Page",
        "Lobby Page (Hosting)",
        "Lobby Page (Joining)",
        "Role Distribution Phase",
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
            <div
                style={{
                flex: 0.35,
                textAlign: "left",
                marginRight: "15px",
                position: "sticky",
                top: "100px", 
                alignSelf: "flex-start",
            }}>
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

                          <h3 style={{ textAlign: "center" }}> Navigation </h3>

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

                          <h3 style={{ textAlign: "center" }}> Asset Manager </h3>

                          <p className="text-muted-foreground" style={{ marginBottom: "20px" }}>
                              You can hover over the box for any available gamemode to reveal a settings icon. Clicking into it will bring up the asset manager. This is one of the most important pages for making
                              the most out of your experience with this app. The first of the two pages is the scenario manager. Here, you can see a list of all current scenarios available to play under as well as add 
                              any new scenarios you wish to have. You can create them either individually and manually or by submitting a file to add many at once. 
                          </p>

                          <img
                              src={scenariomanagerImage}
                              alt="Homepage"
                              style={{ width: "100%", borderRadius: "10px" }}
                          />

                          <p className="text-muted-foreground" style={{ marginBottom: "20px" }}>
                              The second of the two tabs is the asset manager page. Here, you can upload assets of a wide variety of file types as well as links to be viewed during the roleplay phase. Below, you
                                can see a list of all files that have been uploaded so far. The assets are tied to specific scenarios, so be mindful of where you are uploading the files when using the asset manager.
                          </p>

                          <img
                              src={assetmanagerImage}
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

                          <h3 style={{ textAlign: "center" }}> Creating A Lobby </h3>

                          <p className="text-muted-foreground" style={{ marginBottom: "20px" }} >
                              This is the screen that you will see when you select the "Create Lobby" button in the Home Page. The textbox on top is where you will enter your username that will be displayed
                              to all other players. If the textbox is left empty, a default name will be issued to you instead. The second text box determines the size of the lobby that you will be playing in.
                              The lobby has a minimum player limit of 2 and a maximum player limit of 5. Once everything is filled in, click "Create" to start up the lobby.
                          </p>

                          <img
                              src={createlobbyImage}
                              alt="Homepage"
                              style={{ width: "100%", borderRadius: "10px" }}
                          />

                          <h3 style={{ textAlign: "center" }}> Lobby Page (Host View) </h3>

                          <p className="text-muted-foreground" style={{ marginBottom: "20px" }}>
                              This is the lobby page that you will see when you start up a game as the host. Your name will appear at the top of the player list on the right and be marked by
                              a crown. You won't be able to start a round alone so you need to share the lobby code with your friends or coworkers. This can be done by clicking the double square
                              icon next to the code to copy then paste it in a text chat with other potential players. As more players join, their names will appear on the list below you.
                          </p>

                          <p className="text-muted-foreground" style={{ marginBottom: "20px" }}>
                              Below the lobby code, you will see information regarding the voice chat and transcription features for this app. A transcription of what you say during the game is used to 
                              evaluate your performance and give you a final score at the end of the game, so it is important that you enable your microphone for this app to have the full experience. You
                              may test the transcripting feature by enabling your mic and reading the live subtitle preview to ensure you are being heard properly.
                          </p>

                          <p className="text-muted-foreground" style={{ marginBottom: "20px" }}>
                              As the host, you will be able to choose the scenario that all players in the lobby will need to roleplay in. You can either choose a scenario yourself or leave
                              it up to random chance
                          </p>

                          <img
                              src={hostlobbyImage}
                              alt="Homepage"
                              style={{ width: "100%", borderRadius: "10px" }}
                          />

                          <p className="text-muted-foreground" style={{ marginBottom: "20px" }}>
                              Right above the lobby code you will see a settings icon. Clicking into it will reveal a settings menu where you are allowed to set the amount of time that the round
                              will last. You may set the rounds to last as long or as short as you want. 
                          </p>

                          <img
                              src={lobbysettingsImage}
                              alt="Homepage"
                              style={{ width: "100%", borderRadius: "10px" }}
                          />

                          <p className="text-muted-foreground" style={{ marginBottom: "20px" }}>
                              Once all players are in the lobby, you will be able to proceed to the role selection phase and start the game!
                          </p>

                         
                      </>
                  )}

                  {activePanel === "how" && selectedHowStep === 2 && (
                      <>
                          <h2 style={{ textAlign: "center" }} className="text-2xl">
                              {HOW_STEPS[selectedHowStep]}
                          </h2>

                          <h3 style={{ textAlign: "center" }}> Joining a Lobby </h3>

                          <p className="text-muted-foreground" style={{ marginBottom: "20px" }}>
                              This is the screen that you will see when you select the "Join Lobby" button in the Home Page. The textbox on top is where you will enter your username that will be displayed
                              to all other players. If the textbox is left empty, a default name will be issued to you instead. The second textbox is where you paste the lobby code given to you by the host
                              Once everything is filled in, click "Join" to enter the lobby.
                          </p>

                          <img
                              src={joinlobbyImage}
                              alt="Homepage"
                              style={{ width: "100%", borderRadius: "10px" }}
                          />

                          <h3 style={{ textAlign: "center" }}> Lobby Page (Player View) </h3>

                          <p className="text-muted-foreground" style={{ marginBottom: "20px" }}>
                              This is the lobby page that you will see when you join a game as a player. You can see your name on the right side of the screen below the host. Just like
                              the host, you can share the lobby code to invite other players. This can be done by clicking the double square icon next to the code to copy then paste it
                              in a text chat with other potential players. As more players join, their names will appear on the list below you.
                          </p>

                          <p className="text-muted-foreground" style={{ marginBottom: "20px" }}>
                              Below the lobby code, you will see information regarding the voice chat and transcription features for this app. A transcription of what you say during the game is used to
                              evaluate your performance and give you a final score at the end of the game, so it is important that you enable your microphone for this app to have the full experience. You
                              may test the transcripting feature by enabling your mic and reading the live subtitle preview to ensure you are being heard properly.
                          </p>

                          <p className="text-muted-foreground" style={{ marginBottom: "20px" }}>
                              The game will begin once the every player has joined the lobby and the host starts the round.
                          </p>

                          <img
                              src={playerlobbyImage}
                              alt="Homepage"
                              style={{ width: "100%", borderRadius: "10px" }}
                          />
                      </>
                  )}

                  {activePanel === "how" && selectedHowStep === 3 && (
                      <>
                          <h2 style={{ textAlign: "center" }} className="text-2xl">
                              {HOW_STEPS[selectedHowStep]}
                          </h2>

                          <h3 style={{ textAlign: "center" }}> Role Selection </h3>

                          <p className="text-muted-foreground" style={{ marginBottom: "20px" }}>
                              Once the round starts, the first thing that you will be greeted by is the list of roles that you are able to choose from in the given scenario. You must rank these roles on how much
                              you wish to play as them from greatest to least (with 1 being the one you want to play the most). Once you are done with your rankings, click "Submit Rankings" to let the lobby
                              know that you are ready to proceed. You do not need to rank all available roles before submitting.
                          </p>

                          <p className="text-muted-foreground" style={{ marginBottom: "20px" }}>
                             REMEMBER! Having a role ranked as your #1 does not guarantee that it will be the role you receive. 
                          </p>

                          <img
                              src={roleselectImage}
                              alt="Homepage"
                              style={{ width: "100%", borderRadius: "10px" }}
                          />

                          <h3 style={{ textAlign: "center" }}> Role Reveal </h3>

                          <p className="text-muted-foreground" style={{ marginBottom: "20px" }}>
                              When all players are ready, you will be given a role and all relevant information for playing it such as:
                          </p>

                          <ul className="text-muted-foreground" style={{ listStyleType: "disc", marginBottom: "20px" }}>
                              <li>Secret Personality: Your role archetype (Secret) and role name (Revealed to other players)</li>
                              <li>Personality: A general summary of how the role operates</li>
                              <li>Objective: Your main goal during the roleplay phase. This is the same for all players</li>
                              <li>Roleplay Guidelines: Actions that you can take during the roleplay phase that will either gain or lose you points</li>
                          </ul>

                          <p className="text-muted-foreground" style={{ marginBottom: "20px" }}>
                              Once you have read up on this information and believe you understand how to play your role, mark yourself as ready. A start button will appear when all players have
                              finished their preparations.
                          </p>

                          <img
                              src={rolerevealImage}
                              alt="Homepage"
                              style={{ width: "100%", borderRadius: "10px" }}
                          />

                      </>
                  )}

                  {activePanel === "how" && selectedHowStep === 4 && (
                      <>
                          <h2 style={{ textAlign: "center" }} className="text-2xl">
                              {HOW_STEPS[selectedHowStep]}
                          </h2>

                          <p className="text-muted-foreground" style={{ marginBottom: "20px" }}>
                              The roleplay phase is where the main bulk of the game will occur. Players will need to act out their roles in the given time limit in accordance to their role information as 
                              well as the scenario description on the left hand side of the screen. Please refer to the Tutorial section from the top banner and the main screen for more information on how to get
                              the most out of your roleplay experience
                          </p>

                          <img
                              src={roleplayphaseImage}
                              alt="Homepage"
                              style={{ width: "100%", borderRadius: "10px" }}
                          />

                          <p className="text-muted-foreground" style={{ marginBottom: "20px" }}>
                              No need to worry if you forget any of the information about your role from the Role Distribution Phase. All of it can be viewed whenever you need by clicking the "Role Info" button
                              above the asset display box. 
                          </p>

                          <img
                              src={roleplayinfoImage}
                              alt="Homepage"
                              style={{ width: "100%", borderRadius: "10px" }}
                          />

                          <p className="text-muted-foreground" style={{ marginBottom: "20px" }}>
                              If you want to display any images, video, or presentations to the other players to aid in the roleplay process, open the asset manager with the "Select Asset" button.
                              This opens a menu where you can display any files or links that have been previously uploaded to the asset manager in the home menu
                          </p>

                          <img
                              src={roleplayassetsImage}
                              alt="Homepage"
                              style={{ width: "100%", borderRadius: "10px" }}
                          />
                      </>
                  )}

                  {activePanel === "how" && selectedHowStep === 5 && (
                      <>
                          <h2 style={{ textAlign: "center" }} className="text-2xl">
                              {HOW_STEPS[selectedHowStep]}
                          </h2>

                          <h3 style={{ textAlign: "center" }}> Role Guessing </h3>

                          <p className="text-muted-foreground" style={{ marginBottom: "20px" }}>
                              The guessing phase is the final phase of the game. After the timer of the roleplay phase ends, you must predict what role each of the other players was acting as. Each player in the
                              lobby will take turns making their guesses before passing off to the next player. The more correct guesses that you make, the higher your score will be at the end of the game. 
                          </p>

                          <img
                              src={roleguessImage}
                              alt="Homepage"
                              style={{ width: "100%", borderRadius: "10px" }}
                          />

                          <h3 style={{ textAlign: "center" }}> Final Results </h3>

                          <p className="text-muted-foreground" style={{ marginBottom: "20px" }}>
                              The final scores are given to each player based on both the amount of correct guesses they make in the guessing phase and a score given to them by an LLM grader. In the box displaying
                              your score, you will be able to see the correct guesses you made of other players role as well as a short summary of the LLM grader's score, showing where you succeeded and failed in your 
                              roleplay. After seeing this information, you can either return to the lobby or back to the home page of the application.
                          </p>

                          <img
                              src={resultsImage}
                              alt="Homepage"
                              style={{ width: "100%", borderRadius: "10px" }}
                          />
                      </>
                  )}
        </div>
      </div>
    </div>
  );
}