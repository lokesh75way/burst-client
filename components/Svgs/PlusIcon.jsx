import { Rect, Svg } from "react-native-svg";

const PlusIcon = (props) => (
    <Svg {...props}>
        <Rect y="0.5" {...props} rx="10" fill="#268EC8" />
        <Rect x="14.7239" y="6.12" width="2.552" height="12.76" fill="white" />
        <Rect
            x="9.62"
            y="13.776"
            width="2.552"
            height="12.76"
            transform="rotate(-90 9.62 13.776)"
            fill="white"
        />
    </Svg>
);

export default PlusIcon;
