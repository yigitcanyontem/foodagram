import * as React from "react"
import Svg, { Path } from "react-native-svg"
const SearchIcon = ({ fill = "#000", ...props }) => (
    <Svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 11 11"
        {...props}
    >
        <Path
            fill={fill}
            d="M5.26 9.717A4.578 4.578 0 0 1 .688 5.146 4.578 4.578 0 0 1 5.26.574 4.578 4.578 0 0 1 9.83 5.146 4.578 4.578 0 0 1 5.26 9.717Zm0-8.474a3.907 3.907 0 0 0-3.903 3.903A3.907 3.907 0 0 0 5.26 9.048a3.907 3.907 0 0 0 3.902-3.902A3.907 3.907 0 0 0 5.26 1.243ZM9.943 10.163a.33.33 0 0 1-.237-.098l-.892-.892a.337.337 0 0 1 0-.473c.13-.13.344-.13.473 0l.892.892c.13.13.13.344 0 .473a.33.33 0 0 1-.236.098Z"
        />
    </Svg>
)
export default SearchIcon;
