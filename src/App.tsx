import { useState } from "react";
import { twMerge } from "tailwind-merge";
import Collapse from "@mui/material/Collapse";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import useGames from "./hooks/useGames";
import useDevelopers from "./hooks/useDevelopers";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Frame, List, Modal, TaskBar, ThemeProvider } from "@react95/core";
import { Computer } from "@react95/icons";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";
import { faGamepad } from "@fortawesome/free-solid-svg-icons";
import { faGithub } from "@fortawesome/free-brands-svg-icons";

const App = () => {
  const [selectedDevName, setSelectedDevName] = useState<string>("");
  const [selectedDevId, setSelectedDevId] = useState<number | undefined>(
    undefined
  );
  const [selectedGameName, setSelectedGameName] = useState<string>("");
  const [selectedGameId, setSelectedGameId] = useState<number | null>(null);
  const [showModal, toggleShowModal] = useState<boolean>(false);

  const developers = useDevelopers();
  const gameData = useGames(selectedDevId);
  if (!developers) {
    return null;
  }

  function handleReset(backto: "home" | "games") {
    setSelectedGameName("");
    setSelectedGameId(null);
    toggleShowModal(false);

    if (backto === "home") {
      setSelectedDevName("");
      setSelectedDevId(undefined);
    }
  }

  function handleClick(gameId: number, gameName: string) {
    if (selectedGameId === gameId) {
      setSelectedGameName("");
      setSelectedGameId(null);
      return;
    }
    setSelectedGameName(gameName);
    setSelectedGameId(gameId);
  }

  function handleClickDevs(devId: number, devName: string) {
    if (showModal) {
      handleReset("home");
    }
    if (selectedDevName === devName) {
      setSelectedDevName("");
      setSelectedDevId(undefined);
      return;
    }
    setSelectedDevName(devName);
    setSelectedDevId(devId);
  }

  return (
    <>
      <div className="bg-[#018281] h-screen">
        <TableContainer>
          <Table aria-label="collapsible table">
            <TableHead>
              <TableRow className="bg-[#C6C6C6]  divide-x-4 divide-[#A0A0A0] border-b-2 border-[#A0A0A0]">
                {developers.map((dev) => (
                  <TableCell
                    key={dev.id}
                    align="center"
                    className={twMerge(
                      `hover:bg-[#008080] text-base border-b-0`,
                      `${selectedDevName === dev.name ? "bg-[#008080]" : null}`
                    )}
                  >
                    <button
                      className="w-full h-full p-0 m-0"
                      onClick={() => handleClickDevs(dev.id, dev.name)}
                    >
                      {dev.name}
                    </button>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {/* Games */}
              <TableRow>
                <TableCell
                  className="p-0 border-b-0"
                  colSpan={developers.length}
                >
                  {developers.map((dev) => (
                    <Collapse key={dev.id} in={selectedDevName === dev.name}>
                      <TableRow className="bg-[#C6C6C6] divide-x-4 divide-[#A0A0A0] flex">
                        {gameData &&
                          gameData.map((game) => (
                            <TableCell
                              key={game.id}
                              align="center"
                              className={twMerge(
                                `hover:bg-[#008080] border-b-0 text-xs grow justify-center`,
                                `${
                                  selectedGameName === game.name && showModal
                                    ? "bg-[#008080]"
                                    : null
                                }`
                              )}
                            >
                              <button
                                onClick={() => {
                                  handleClick(game.id, game.name);
                                  toggleShowModal(true);
                                }}
                              >
                                {game.name}
                              </button>
                            </TableCell>
                          ))}
                      </TableRow>
                    </Collapse>
                  ))}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>

        <ThemeProvider theme="win95">
          {gameData &&
            showModal &&
            gameData
              .filter((game) => game.id === selectedGameId)
              .map((game) => (
                <div key={game.id} className="text-xs">
                  <Modal
                    width="1000"
                    height="200"
                    style={{ top: 0 }}
                    icon={<Computer variant="32x32_4" />}
                    title={game.name}
                    defaultPosition={{
                      x: window.innerWidth / 4,
                      y: 300,
                    }}
                    closeModal={() => handleReset("games")}
                  >
                    <div className="w-full m-auto font-win95">
                      <Frame height="100%" width="100%" boxShadow="in">
                        <Table>
                          <TableHead>
                            <TableRow className="divide-x">
                              {Object.entries(game).map(([key]) => (
                                <TableCell
                                  key={key}
                                  className="font-win95 text-sm"
                                >
                                  {key.toUpperCase()}
                                </TableCell>
                              ))}
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            <TableRow className="divide-x">
                              <TableCell>{game.id}</TableCell>
                              <TableCell>{game.name}</TableCell>
                              <TableCell>{game.rating}</TableCell>

                              <TableCell>
                                {game.genres.map(
                                  (genre) => `* ${genre.name} * `
                                )}
                              </TableCell>
                              <TableCell>{game.released}</TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </Frame>
                    </div>
                  </Modal>
                </div>
              ))}
        </ThemeProvider>

        <div className="flex justify-center mt-5">
          <Breadcrumbs aria-label="breadcrumb">
            <Link
              underline="hover"
              color="inherit"
              href="#"
              onClick={() => handleReset("home")}
            >
              Home - Developers
            </Link>
            {selectedDevName && (
              <Link
                underline="hover"
                color="inherit"
                href="#"
                onClick={() => handleReset("games")}
              >
                {selectedDevName}
              </Link>
            )}
            {showModal && (
              <Link underline="hover" color="inherit" href="#">
                {selectedGameName}
              </Link>
            )}
          </Breadcrumbs>
        </div>

        <div className="text-xs">
          <ThemeProvider>
            <TaskBar
              list={
                <List>
                  <Link
                    underline="hover"
                    color="inherit"
                    href="https://github.com/martwy?tab=repositories"
                    target="_blank"
                  >
                    <List.Item
                      icon={
                        <FontAwesomeIcon
                          icon={faGithub}
                          className="text-3xl mr-2 mb-1"
                        />
                      }
                    >
                      Github
                    </List.Item>
                  </Link>
                  <List.Divider />
                  <Link
                    underline="hover"
                    color="inherit"
                    href="https://api.rawg.io/docs/"
                    target="_blank"
                  >
                    <List.Item
                      icon={
                        <FontAwesomeIcon
                          icon={faGamepad}
                          className="text-2xl mr-2"
                        />
                      }
                    >
                      Rawg.io API
                    </List.Item>
                  </Link>
                </List>
              }
            />
          </ThemeProvider>
        </div>
      </div>
    </>
  );
};

export default App;
