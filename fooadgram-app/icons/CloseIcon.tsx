import * as React from "react"
import Svg, { Path } from "react-native-svg"

const CloseIcon = ({ fill = "#000", ...props }) => (
    <Svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        {...props}
    >
        <Path
            stroke={fill}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M12 22c5.5 0 10-4.5 10-10S17.5 2 12 2 2 6.5 2 12s4.5 10 10 10ZM9.17 14.83l5.66-5.66M14.83 14.83 9.17 9.17"
        />
    </Svg>
)
export default CloseIcon;
