import * as React from "react"
import Svg, { Path } from "react-native-svg"
const DownIcon = ({ fill = "#000", ...props }) => (
    <Svg
        xmlns="http://www.w3.org/2000/svg"
        width={16}
        height={16}
        fill="none"
        viewBox="0 0 24 24"
        {...props}
    >
        <Path
            stroke={fill}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeMiterlimit={10}
            strokeWidth={1.5}
            d="m19.92 8.95-6.52 6.52c-.77.77-2.03.77-2.8 0L4.08 8.95"
        />
    </Svg>
)
export default DownIcon
