import * as React from "react";
import Svg, { Path } from "react-native-svg";

function SearchSVG({ width = 25, height = 25, stroke = "#189AE2", ...props }) {
    return (
        <Svg
            width={width}
            height={height}
            viewBox="0 0 25 25"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <Path
                d="M19.245 19.4L24 24m-1.533-12.267c0 5.928-4.806 10.734-10.734 10.734S1 17.66 1 11.733 5.805 1 11.733 1c5.928 0 10.734 4.805 10.734 10.733z"
                stroke={stroke}
                strokeWidth={2}
                strokeLinecap="round"
            />
        </Svg>
    );
}

export default SearchSVG;
