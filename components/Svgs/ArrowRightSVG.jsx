import * as React from "react";
import Svg, { Path } from "react-native-svg";

function ArrowRightSVG(props) {
    return (
        <Svg
            width={10}
            height={12}
            viewBox="0 0 10 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <Path
                d="M1.591 1L8.86 6 1.59 11"
                stroke={props.color}
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </Svg>
    );
}

export default ArrowRightSVG;
