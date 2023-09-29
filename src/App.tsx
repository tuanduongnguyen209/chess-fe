import { createContext, useMemo } from "react";
import "./App.css";
import { v4 as uuidv4 } from "uuid";
import GameList from "src/components/GameList";
import GameBoard from "src/components/GameBoard";
import { Route, RouterProvider, Routes } from "react-router";
import { createBrowserRouter } from "react-router-dom";

export const GameContext = createContext({
    playerId: "",
});

const router = createBrowserRouter([{ path: "*", Component: Root }]);

function App() {
    const playerId = useMemo(() => {
        const storedPlayerId = localStorage.getItem("playerId");
        if (storedPlayerId) return storedPlayerId;
        const newPlayerId = uuidv4();
        localStorage.setItem("playerId", newPlayerId);
        return newPlayerId;
    }, []);

    return (
        <GameContext.Provider
            value={{
                playerId,
            }}
        >
            <RouterProvider router={router} />
        </GameContext.Provider>
    );
}

function Root() {
    return (
        <Routes>
            <Route path="/game/:gameId" element={<GameBoard />} />

            <Route path="/" element={<GameList />} />
        </Routes>
    );
}

export default App;
