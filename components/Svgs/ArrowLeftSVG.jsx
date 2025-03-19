import * as React from "react";
import Svg, { Path } from "react-native-svg";

function ArrowLeftSVG(props) {
    return (
        <Svg
            width={10}
            height={props.height ?? 20}
            viewBox="0 0 31 56"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <Path
                d="M28 53L3 28 28 3"
                stroke={props.stroke ?? "#000"}
                strokeWidth={6}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </Svg>
    );
}

export default ArrowLeftSVG;
