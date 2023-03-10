import { useState, useEffect } from "react";
import "./styles/reset.css";
import "./styles/App.css";
import dateFormatter from "./util/dateFormatter";
import { io } from "socket.io-client";
import { Pilot, Observation } from "./types";
import Map from "./components/Map";
import useWindowSize from "./hooks/useWindowSize";

const socket = io(process.env.REACT_APP_BACKEND_URL || "http://localhost:8080");

function App() {
    const [data, setData] = useState<[Observation[], Pilot[]]>([[], []]);
    const { width } = useWindowSize();
    socket.connect();

    // Sort criteria for the table, first by last seen, then by last name
    function sortCriteria(a: Pilot, b: Pilot) {
        return (
            new Date(b.lastSeen).getTime() - new Date(a.lastSeen).getTime() ||
            b.lastName.localeCompare(a.lastName)
        );
    }

    // Check if pilot is in violation now
    function inViolationNow(pilot: Pilot): boolean {
        // First check that the pilot really has been seen recently compared to system time
        const recentlySeen = new Date(pilot.lastSeen).getTime() > new Date().getTime() - 1000 * 6;
        return recentlySeen && pilot.lastSeen === pilot.lastViolation;
    }

    useEffect(() => {
        socket.on("connect", () => {
            console.log("connected");
        });

        socket.on("disconnect", () => {
            console.log("disconnected");
        });

        // Listen for data from the backend
        socket.on("data", (data) => {
            setData(data);
        });
        return () => {
            socket.off("data");
        };
    }, []);

    return (
        <div className="pageContainer">
            <main>
                <h1>Bird Sanctuary Violations </h1>
                <article>
                    <h2>Live Drone Map</h2>
                    <Map sideLength={width ? Math.min(width * 0.9, 400) : 400} data={data[0]} />
                </article>
                <article>
                    <h2>Recent Violators</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th>Closest</th>
                                <th>Last&nbsp;seen</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data[1].sort(sortCriteria).map((pilot) => {
                                const isInViolationNow = inViolationNow(pilot);
                                return (
                                    <tr key={pilot.serialNumber}>
                                        <td style={isInViolationNow ? { color: "red" } : undefined}>
                                            {pilot.firstName}&nbsp;{pilot.lastName}
                                        </td>
                                        <td>{pilot.email}</td>
                                        <td>{pilot.phoneNumber}</td>
                                        <td style={{ textAlign: "right" }}>
                                            {pilot.closestDistance.toFixed(0)}m
                                        </td>
                                        <td>{dateFormatter(pilot.lastSeen)}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </article>
            </main>
        </div>
    );
}

export default App;
