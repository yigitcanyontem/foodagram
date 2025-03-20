import * as React from "react"
import Svg, { Path } from "react-native-svg"
const BookMarkIcon = (props) => (
    <Svg
        xmlns="http://www.w3.org/2000/svg"
        width={20}
        height={22}
        fill="none"
        {...props}
    >
        <Path
            stroke="#292D32"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M14.82 1H5.18C3.05 1 1.32 2.74 1.32 4.86v14.09c0 1.8 1.29 2.56 2.87 1.69l4.88-2.71c.52-.29 1.36-.29 1.87 0l4.88 2.71c1.58.88 2.87.12 2.87-1.69V4.86C18.68 2.74 16.95 1 14.82 1Z"
        />
        <Path
            stroke="#292D32"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="m7.59 10 1.5 1.5 4-4"
        />
    </Svg>
)
export default BookMarkIcon
