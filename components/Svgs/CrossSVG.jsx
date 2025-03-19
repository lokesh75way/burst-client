import * as React from "react";
import Svg, { Path } from "react-native-svg";

function CrossSVG(props) {
    return (
        <Svg
            width={props.width ?? 28}
            height={props.height ?? 28}
            viewBox="0 0 75 75"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <Path
                d="M56.25 18.75l-37.5 37.5m37.5 0l-37.5-37.5"
                stroke={props.fill ?? "#535353"}
                strokeWidth={5}
                strokeLinecap="round"
            />
        </Svg>
    );
}

export default CrossSVG;
