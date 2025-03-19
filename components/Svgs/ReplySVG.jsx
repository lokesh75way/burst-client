import * as React from "react";
import Svg, { Path } from "react-native-svg";

function ReplySVG(props) {
    return (
        <Svg
            width={22}
            height={22}
            viewBox="0 0 14 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <Path
                d="M6.532 10.94h0l-2.474 1.823v-.66c0-.785-.631-1.44-1.433-1.44H1.75a.912.912 0 01-.9-.924V2.65c0-.52.413-.923.9-.923h10.5c.487 0 .9.403.9.923v7.09c0 .52-.413.923-.9.923H7.38c-.306 0-.603.098-.848.279zm-2.901 2.138s0 0 0 0h0z"
                stroke="#687684"
                strokeWidth={1.7}
            />
        </Svg>
    );
}

export default ReplySVG;
