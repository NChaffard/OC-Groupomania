export const AddImage = ({ className = "icon" }) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            className={className}
        >
            <path
                fill="currentColor"
                d="M21 15v3h3v2h-3v3h-2v-3h-3v-2h3v-3h2zm.008-12c.548 0 .992.445.992.993v9.349A5.99 5.99 0 0 0 20 13V5H4l.001 14l9.292-9.293a.999.999 0 0 1 1.32-.084l.093.085l3.546 3.55a6.003 6.003 0 0 0-3.91 7.743L2.992 21A.993.993 0 0 1 2 20.007V3.993A1 1 0 0 1 2.992 3h18.016zM8 7a2 2 0 1 1 0 4a2 2 0 0 1 0-4z"
            >
            </path>
        </svg>
    )
}

export const AddPost = ({ className = "icon" }) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            className={className}
        >
            <path
                fill="currentColor"
                d="M4 12h16V8H4Zm15 10v-3h-3v-2h3v-3h2v3h3v2h-3v3ZM4 20q-.825 0-1.412-.587Q2 18.825 2 18V6q0-.825.588-1.412Q3.175 4 4 4h16q.825 0 1.413.588Q22 5.175 22 6v6h-3q-2.075 0-3.537 1.462Q14 14.925 14 17v3Z"
            >
            </path>
        </svg>
    )
}

export const Home = ({ className = "icon" }) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            className={className}
        >
            <path
                fill="currentColor"
                d="M10 20v-6h4v6h5v-8h3L12 3L2 12h3v8z"
            >
            </path>
        </svg>)
}

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

export const Logout = ({ className = "icon" }) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            className={className}
        >
            <path
                fill="currentColor"
                d="M5 21q-.825 0-1.413-.587Q3 19.825 3 19V5q0-.825.587-1.413Q4.175 3 5 3h7v2H5v14h7v2Zm11-4l-1.375-1.45l2.55-2.55H9v-2h8.175l-2.55-2.55L16 7l5 5Z"
            >
            </path>
        </svg>
    )
}

export const Pen = ({ className = "icon" }) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            className={className}
        >
            <path
                fill="currentColor"
                d="M16.84 2.73c-.39 0-.77.15-1.07.44l-2.12 2.12l5.3 5.31l2.12-2.1c.6-.61.6-1.56 0-2.14L17.9 3.17c-.3-.29-.68-.44-1.06-.44M12.94 6l-8.1 8.11l2.56.28l.18 2.29l2.28.17l.29 2.56l8.1-8.11m-14 3.74L2.5 21.73l6.7-1.79l-.24-2.16l-2.31-.17l-.18-2.32"
            >
            </path>
        </svg>
    )
}

export const Trash = ({ className = "icon" }) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            className={className}
            viewBox="0 0 512 512"
        >
            <path
                d="M128 405.429C128 428.846 147.198 448 170.667 448h170.667C364.802 448 384 428.846 384 405.429V160H128v245.429zM416 96h-80l-26.785-32H202.786L176 96H96v32h320V96z"
                fill="currentColor"
            >
            </path>
        </svg>
    )
}