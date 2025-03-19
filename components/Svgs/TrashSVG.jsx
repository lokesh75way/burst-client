import * as React from "react";
import Svg, { Path } from "react-native-svg";

function TrashSVG(props) {
    return (
        <Svg
            width={18}
            height={24}
            viewBox="0 0 56 62"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <Path
                d="M39.667 13.5v-2.333c0-3.267 0-4.9-.636-6.149a5.834 5.834 0 00-2.55-2.549c-1.247-.636-2.88-.636-6.148-.636h-4.666c-3.267 0-4.9 0-6.149.636a5.834 5.834 0 00-2.549 2.55c-.636 1.247-.636 2.88-.636 6.148V13.5m5.834 16.042v14.583m11.666-14.583v14.583M1.75 13.5h52.5m-5.833 0v32.667c0 4.9 0 7.35-.954 9.222a8.75 8.75 0 01-3.824 3.824c-1.872.954-4.322.954-9.222.954H21.583c-4.9 0-7.35 0-9.222-.954a8.75 8.75 0 01-3.824-3.824c-.954-1.872-.954-4.322-.954-9.222V13.5"
                stroke="#959696"
                strokeWidth={3}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </Svg>
    );
}

export default TrashSVG;
