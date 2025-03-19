import * as React from "react";
import Svg, { Path } from "react-native-svg";
const CheckBoxIcon = ({ fill = "#479ae2", ...props }) => (
    <Svg
        xmlns="http://www.w3.org/2000/svg"
        width={32}
        height={32}
        viewBox="0 0 32 32"
        {...props}
    >
        <Path
            d="M16 29.332c-6.285 0-9.43 0-11.379-1.953C2.668 25.429 2.668 22.285 2.668 16c0-6.285 0-9.43 1.953-11.379C6.571 2.668 9.715 2.668 16 2.668c6.285 0 9.43 0 11.379 1.953 1.953 1.95 1.953 5.094 1.953 11.379 0 6.285 0 9.43-1.953 11.379-1.95 1.953-5.094 1.953-11.379 1.953Zm5.375-17.371a1 1 0 0 1 0 1.414l-6.668 6.664a1 1 0 0 1-1.414 0l-2.668-2.664a1 1 0 1 1 1.414-1.414L14 17.918l5.96-5.957a1 1 0 0 1 1.415 0Zm0 0"
            style={{
                stroke: "none",
                fillRule: "evenodd",
                fill,
                fillOpacity: 1,
            }}
        />
    </Svg>
);
export default CheckBoxIcon;
