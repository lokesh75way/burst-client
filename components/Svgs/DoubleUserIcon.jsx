import { Path, Svg } from "react-native-svg";

const DoubleUserIcon = (props) => (
    <Svg {...props}>
        <Path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M16.6667 18.8333C20.3486 18.8333 23.3333 15.8486 23.3333 12.1667C23.3333 8.48477 20.3486 5.5 16.6667 5.5C12.9848 5.5 10 8.48477 10 12.1667C10 15.8486 12.9848 18.8333 16.6667 18.8333ZM16.6667 35.5C23.11 35.5 28.3333 32.5152 28.3333 28.8333C28.3333 25.1514 23.11 22.1667 16.6667 22.1667C10.2233 22.1667 5 25.1514 5 28.8333C5 32.5152 10.2233 35.5 16.6667 35.5ZM23.269 18.5258C24.8569 16.8775 25.8333 14.6362 25.8333 12.1668C25.8333 10.9925 25.6125 9.86973 25.2101 8.83781C27.874 8.94799 29.9999 11.1425 29.9999 13.8335C29.9999 16.5949 27.7613 18.8335 24.9999 18.8335C24.3914 18.8335 23.8084 18.7248 23.269 18.5258ZM30.8332 28.8332C30.8332 29.7312 30.6336 30.5991 30.2616 31.4192C33.1057 30.5376 34.9998 28.9627 34.9998 27.1665C34.9998 24.6562 31.2999 22.578 26.4779 22.2208C29.1623 23.8889 30.8332 26.2348 30.8332 28.8332Z"
            fill={props.fill}
            fill-opacity="0.4"
        />
    </Svg>
);

export default DoubleUserIcon;
