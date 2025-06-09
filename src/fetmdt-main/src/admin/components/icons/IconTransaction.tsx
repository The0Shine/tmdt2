import { SVGProps } from 'react'

const IconTransaction = (props: SVGProps<SVGSVGElement>) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 48 48"
            width="1em"
            height="1em"
            {...props}
        >
            <g
                fill="none"
                stroke="currentColor"
                strokeLinejoin="round"
                strokeWidth="2"
            >
                <rect width="30" height="36" x="9" y="8" rx="2"></rect>
                <path
                    strokeLinecap="round"
                    stroke="currentColor" // thêm dòng này
                    strokeWidth="2"
                    d="M18 4v6m12-6v6m-14 9h16m-16 8h12m-12 8h8"
                ></path>
            </g>
        </svg>
    )
}
export default IconTransaction
