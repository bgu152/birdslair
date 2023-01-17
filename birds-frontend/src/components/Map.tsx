import * as d3 from "d3";
import { AxisLeft } from "./AxisLeft";
import { AxisBottom } from "./AxisBottom";
import { Sighting } from "../types";
import distance from "../util/distance";
import mapImage from "../assets/map.png";

const MARGIN = { top: 60, right: 60, bottom: 60, left: 60 };

type ScatterplotProps = {
    sideLength: number;
    data: Sighting[];
};

const Map = ({ sideLength, data }: ScatterplotProps) => {
    const boundsWidth = sideLength - MARGIN.right - MARGIN.left;
    const boundsHeight = (sideLength - MARGIN.top - MARGIN.bottom);
    console.log(boundsHeight) 

    // Scales
    const yScale = d3.scaleLinear().domain([0, 500]).range([boundsHeight, 0]);
    const xScale = d3.scaleLinear().domain([0, 500]).range([0, boundsWidth]);

    // Build the drones
    const allShapes = data.map((d: Sighting, i) => {
        return (
            <circle
                key={i}
                r={10}
                cx={xScale(d.positionY / 1000)}
                cy={yScale(d.positionX / 1000)}
                opacity={1}
                stroke={distance(d) > 100 ? "#cb1dd1" : "red"}
                fill={distance(d) > 100 ? "#cb1dd1" : "red"}
                fillOpacity={0.2}
                strokeWidth={1}
            />
        );
    });

    // Build the boundary
    const boundary = () => {
        return <circle key={-1} r={xScale(100)} cx={xScale(250)} cy={yScale(250)} opacity={1} stroke="white" fillOpacity={0.2} strokeWidth={1} />;
    };

    allShapes.push(boundary());

    return (
        <div
            style={{
                position: 'relative',
                marginTop: 20,
            }}
        >
            <div style={{
              position:'absolute'
            }}>
                <svg width={sideLength} height={sideLength} >

                    <g width={boundsWidth} height={boundsHeight} transform={`translate(${[MARGIN.left, MARGIN.top].join(",")})`}>
                        {/* Y axis */}
                        <AxisLeft yScale={yScale} pixelsPerTick={40} width={boundsWidth} />

                        {/* X axis */}
                        <g transform={`translate(0, ${boundsHeight})`}>
                            <AxisBottom xScale={xScale} pixelsPerTick={40} height={boundsHeight} />
                        </g>

                        {/* Drones */}
                        {allShapes}
                    </g>
                </svg>
            </div>
            <img
                src={mapImage}
                alt="map of drone area"
                style={{
                    width: sideLength,
                    height: sideLength,
                }}
            />
            <i>Image created by DALL·E 2 using the prompt "satellite map of finnish archipelago." </i> <br/>
            <i>Credit to <a href="https://www.react-graph-gallery.com/">The React Graph Gallery</a> for the plot template.</i>
        </div>
    );
};

export default Map;
