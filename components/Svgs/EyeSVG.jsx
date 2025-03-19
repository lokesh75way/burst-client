import * as React from "react";
import Svg, { Path } from "react-native-svg";

function EyeSVG(props) {
    return (
        <Svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 576 512"
            {...props}
        >
            <Path d="M572.5 241.4C518.3 135.6 410.9 64 288 64S57.7 135.6 3.5 241.4a32.4 32.4 0 000 29.2C57.7 376.4 165.1 448 288 448s230.3-71.6 284.5-177.4a32.4 32.4 0 000-29.2zM288 400a144 144 0 11144-144 143.9 143.9 0 01-144 144zm0-240a95.3 95.3 0 00-25.3 3.8 47.9 47.9 0 01-66.9 66.9A95.8 95.8 0 10288 160z" />
        </Svg>
    );
}

export default EyeSVG;
