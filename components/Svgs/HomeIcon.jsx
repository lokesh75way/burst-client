import { Path, Svg } from "react-native-svg";

function HomeIcon(props) {
    return (
        <Svg
            width={124}
            height={124}
            viewBox="0 0 124 124"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <Path
                d="M104.007 63.241v28.421c0 9.107-7.116 16.519-15.884 16.519H72.24v-20.33a4.917 4.917 0 00-4.913-4.914H55.975c-2.71 0-4.87 2.202-4.87 4.913v20.331H35.177c-8.767 0-15.883-7.412-15.883-16.519v-28.42c0-4.872 2.075-9.488 5.633-12.665l26.473-23.211c5.972-5.21 14.57-5.21 20.5 0l26.473 23.21c3.6 3.178 5.633 7.794 5.633 12.665z"
                fill={props.fill}
            />
        </Svg>
    );
}

export default HomeIcon;
