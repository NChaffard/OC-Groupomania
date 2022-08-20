export const Like = ({ className = "icon", stroke = null }) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            className={className}
            stroke={stroke}
        >
            <path
                fill="currentColor"
                d="M18 21H8V8l7-7l1.25 1.25q.175.175.288.475q.112.3.112.575v.35L15.55 8H21q.8 0 1.4.6q.6.6.6 1.4v2q0 .175-.038.375q-.037.2-.112.375l-3 7.05q-.225.5-.75.85T18 21ZM6 8v13H2V8Z"
            >
            </path>
        </svg>
    )
}