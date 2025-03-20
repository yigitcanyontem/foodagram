import * as React from "react"
import Svg, { Path } from "react-native-svg"
const MenuIcon = ({ fill = "#000", ...props }) => (
    <Svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox={"0 0 24 20"}
        {...props}
    >
        <Path
            stroke={fill}
            strokeLinecap="round"
            strokeWidth={1.5}
            d="M3 3h18M3 10h18M3 17h18"
        />
    </Svg>
)
export default MenuIcon;
