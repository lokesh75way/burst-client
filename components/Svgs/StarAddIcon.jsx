import * as React from "react";
import Svg, { Path } from "react-native-svg";
/* SVGR has dropped some elements not supported by react-native-svg: title */
const StarAddIcon = (props) => (
    <Svg
        xmlns="http://www.w3.org/2000/svg"
        width={20}
        height={20}
        viewBox="0 0 24 24"
        {...props}
    >
        <Path
            fill="#479ae2"
            fillRule="nonzero"
            d="M17.5 12a5.5 5.5 0 1 1 0 11 5.5 5.5 0 0 1 0-11Zm-4.827-9.24 2.683 5.448 6.011.869a.75.75 0 0 1 .416 1.279l-1.368 1.333a6.5 6.5 0 0 0-9.247 7.287l-4.541 2.392a.75.75 0 0 1-1.09-.79l1.032-5.986-4.352-4.236a.75.75 0 0 1 .416-1.28l6.01-.868 2.684-5.448a.75.75 0 0 1 1.346 0ZM17.5 14l-.09.007a.5.5 0 0 0-.402.402L17 14.5V17L14.498 17l-.09.008a.5.5 0 0 0-.402.402l-.008.09.008.09a.5.5 0 0 0 .402.402l.09.008H17v2.503l.008.09a.5.5 0 0 0 .402.402l.09.008.09-.008a.5.5 0 0 0 .402-.402l.008-.09V18l2.504.001.09-.008a.5.5 0 0 0 .402-.402l.008-.09-.008-.09a.5.5 0 0 0-.403-.402l-.09-.008H18v-2.5l-.008-.09a.5.5 0 0 0-.402-.403L17.5 14Z"
        />
    </Svg>
);
export default StarAddIcon;
