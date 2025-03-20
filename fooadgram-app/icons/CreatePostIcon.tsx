import * as React from "react"
import Svg, { Path } from "react-native-svg"
const CreatePostIcon = (props) => (
    <Svg
        xmlns="http://www.w3.org/2000/svg"
        width={22}
        height={22}
        fill="none"
        {...props}
    >
        <Path
            stroke="#292D32"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M11 21c5.5 0 10-4.5 10-10S16.5 1 11 1 1 5.5 1 11s4.5 10 10 10ZM7 11h8M11 15V7"
        />
    </Svg>
)
export default CreatePostIcon
