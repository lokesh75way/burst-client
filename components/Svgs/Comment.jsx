import * as React from "react";
import Svg, { Path } from "react-native-svg";

function Comment(props) {
    return (
        <Svg
            width={25}
            height={26}
            viewBox="0 0 25 26"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <Path
                d="M24.228 12.299l.002.036a10.914 10.914 0 01-1.204 5.686h0a3.538 3.538 0 00-.218 2.76l.001.003 1.05 3.12-3.582-.98-.011-.004-.012-.003c-.83-.2-1.768-.167-2.605.214l-.007.003-.007.004a11.686 11.686 0 01-5.452 1.13l-.005-.001C5.954 24.109.882 19.162.752 13.238.622 6.682 6.31 1.296 13.258 1.738h.004c5.894.346 10.61 4.943 10.966 10.56z"
                stroke="#0F4564"
                strokeWidth={1.5}
            />
        </Svg>
    );
}

export default Comment;
