import * as React from "react";
import Svg, { Path } from "react-native-svg";
const ChcekIcon = (props) => (
    <Svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width={24}
        height={24}
        fill="none"
        stroke="#fff"
        viewBox="0 0 24 24"
    >
        <Path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 12.611 8.923 17.5 20 6.5"
        />
    </Svg>
);
export default ChcekIcon;
