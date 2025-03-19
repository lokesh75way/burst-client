import * as React from "react";
import Svg, { Path } from "react-native-svg";

function PlusIconSVG(props) {
    return (
        <Svg
            width={79}
            height={77}
            viewBox="0 0 79 77"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <Path
                d="M.285 46.036H78.53V31.23H.285v14.806zm31.719 30.291h14.732V.939H32.004v75.388z"
                fill="#fff"
            />
        </Svg>
    );
}

export default PlusIconSVG;
