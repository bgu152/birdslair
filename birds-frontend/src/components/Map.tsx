import * as d3 from "d3";
import { AxisLeft } from "./AxisLeft";
import { AxisBottom } from "./AxisBottom";
import { Observation } from "../types";
import distance from "../util/distance";
import mapImage from "../assets/map.png";

// Based on templates from https://observablehq.com/@d3/zoomable-circle-packing

const MARGIN = { top: 60, right: 60, bottom: 60, left: 60 };

type ScatterplotProps = {
    sideLength: number;
    data: Observation[];
};

const Map = ({ sideLength, data }: ScatterplotProps) => {
    const boundsWidth = sideLength - MARGIN.right - MARGIN.left;
    const boundsHeight = sideLength - MARGIN.top - MARGIN.bottom;

    // Scales
    const yScale = d3.scaleLinear().domain([0, 500]).range([boundsHeight, 0]);
    const xScale = d3.scaleLinear().domain([0, 500]).range([0, boundsWidth]);

    // Build the drones
    const allShapes = data.map((observation: Observation, i) => {
        return (
            <circle
                key={i}
                r={10}
                cx={xScale(observation.positionY / 1000)}
                cy={yScale(observation.positionX / 1000)}
                opacity={1}
                stroke={distance(observation) > 100 ? "#cb1dd1" : "red"}
                fill={distance(observation) > 100 ? "#cb1dd1" : "red"}
                fillOpacity={0.2}
                strokeWidth={1}
            />
        );
    });

    // Build the boundary of the forbidden zone
    const boundary = () => {
        return (
            <circle
                key={-1}
                r={xScale(100)}
                cx={xScale(250)}
                cy={yScale(250)}
                opacity={1}
                stroke="white"
                fillOpacity={0.2}
                strokeWidth={1}
            />
        );
    };

    allShapes.push(boundary());

    return (
        <div className="mapContainer">
            <div className="mapSvgContainer">
                <svg width={sideLength} height={sideLength}>
                    <g
                        width={boundsWidth}
                        height={boundsHeight}
                        transform={`translate(${[MARGIN.left, MARGIN.top].join(",")})`}
                    >
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
            <p>
                <i>
                    Image created by <a href ="https://openai.com/dall-e-2/">DALL·E 2</a> using the prompt "satellite map of finnish
                    archipelago".
                    <br />
                    The drone plot is based on <a href="https://github.com/holtzy/react-graph-gallery/tree/main/viz/ScatterplotHoverHighlight">these templates</a> by Yan Holtz.
                </i>
            </p>
            <p>
                The circle in the middle is the forbidden zone. <br />
                Drones violating the perimeter are shown in red.{" "}
            </p>
        </div>
    );
};

export default Map;
