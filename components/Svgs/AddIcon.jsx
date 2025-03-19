import * as React from "react";
import Svg, { G, Path } from "react-native-svg";
/* SVGR has dropped some elements not supported by react-native-svg: title */
const AddIcon = (props) => (
    <Svg
        xmlns="http://www.w3.org/2000/svg"
        width={24}
        height={24}
        fill="#fff"
        stroke="#fff"
        viewBox="0 0 24 24"
        {...props}
    >
        <G
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            data-name="add"
        >
            <Path d="M12 19V5M5 12h14" />
        </G>
    </Svg>
);
export default AddIcon;
