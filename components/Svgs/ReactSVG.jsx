import * as React from "react";
import Svg, { Path } from "react-native-svg";

function ReactSVG(props) {
    return (
        <Svg
            width={22}
            height={22}
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <Path
                d="M7 13H4a2 2 0 01-2-2V4a2 2 0 012-2h7a2 2 0 012 2v3a1 1 0 002 0V4a4 4 0 00-4-4H4a4 4 0 00-4 4v7a4 4 0 004 4h3a1 1 0 000-2z"
                fill="#687684"
            />
            <Path
                d="M15 11.75h-1.25V10.5a1 1 0 00-2 0v1.25H10.5a1 1 0 100 2h1.25V15a1 1 0 002 0v-1.25H15a1 1 0 000-2zM5.75 6a1 1 0 11-2 0 1 1 0 012 0zM11.25 6a1 1 0 11-2 0 1 1 0 012 0zM9.555 8.417a1 1 0 00-1.387.278.682.682 0 01-.57.305H7.4a.682.682 0 01-.57-.305 1 1 0 10-1.665 1.11A2.68 2.68 0 007.403 11H7.6a2.68 2.68 0 002.233-1.195 1 1 0 00-.278-1.388z"
                fill="#687684"
            />
        </Svg>
    );
}

export default ReactSVG;
