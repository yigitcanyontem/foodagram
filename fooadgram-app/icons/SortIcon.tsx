import * as React from "react"
import Svg, { Path } from "react-native-svg"
const SortIcon = ({ fill = "#000", ...props }) => (
    <Svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        width={18}
        height={18}
        viewBox="0 0 24 24"
        {...props}
    >
        <Path
            stroke={fill}
            strokeLinecap="round"
            strokeWidth={1.5}
            d="M3 7h18M6 12h12M10 17h4"
        />
    </Svg>
)
export default SortIcon
