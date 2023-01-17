
import { useState, useEffect } from "react";
import "./styles/reset.css";
import "./styles/App.css";
import dateFormatter from "./util/dateFormatter";
import { io } from "socket.io-client";
import { Pilot, Sighting } from "./types";
import Map from "./components/Map";
import useWindowSize from "./hooks/useWindowSize";

const socket = io(process.env.REACT_APP_BACKEND_URL || "http://localhost:8080");
// const socket = io("https://www.api.birdslair.com");

function App() {
    const [data, setData] = useState<[Sighting[],Pilot[]]>([[],[]]);
    const { width } = useWindowSize();
    socket.connect();

    function sortCriteria(a: Pilot, b: Pilot) {
        return new Date(b.lastSeen).getTime() - new Date(a.lastSeen).getTime() || b.lastName.localeCompare(a.lastName);
    }

    // Check if pilot is in violation now
    function inViolationNow(pilot: Pilot): boolean {
        //Making sure the the pilot has been seen recently, allowing 6s lag
        const recentlySeen = new Date(pilot.lastSeen).getTime() > new Date().getTime() - 1000 * 6;
        console.log(new Date(pilot.lastSeen).getTime() -( new Date().getTime()));
        return recentlySeen && pilot.lastSeen === pilot.lastViolation;
    }

    useEffect(() => {
        socket.on("connect", () => {
            console.log("connected");
        });

        socket.on("disconnect", () => {
            console.log("disconnected");
        });
        socket.on("data", (data) => {
            setData(data);
        });
        return () => {
            socket.off("Pilots");
            socket.off("sightings");
            socket.off("connect");
        };
    }, []);

    return (
        <div className="pageContainer">
            <h1>Bird Sanctuary Violations </h1>

            <main>
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
                                        <td style={{ textAlign: "right" }}>{pilot.closestDistance.toFixed(0)}m</td>
                                        <td>{dateFormatter(new Date(pilot.lastSeen))}</td>
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
