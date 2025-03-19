import * as React from "react";
import Svg, { Path } from "react-native-svg";

function PlusSVG(props) {
    return (
        <Svg
            width={29}
            height={29}
            viewBox="0 0 29 29"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <Path fill="#268EC8" d="M13 0H17V29H13z" />
            <Path
                transform="rotate(90 29 13)"
                fill="#268EC8"
                d="M29 13H33V42H29z"
            />
        </Svg>
    );
}

export default PlusSVG;
