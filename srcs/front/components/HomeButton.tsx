import Link from "next/link";
import React from "react";
import img_logo from "../public/Logo.png"

function B_Home() {

    const HomeButton: React.CSSProperties = {
        position: 'absolute',
        width: '110px',
        height: '100px',
        top: '10px',
        left: '10px',
        cursor: 'pointer',
    };

    return (
        <Link href={"/menu"}>
            <img src='./Logo.png' alt="Logo of 42Pong" style={HomeButton} />
        </Link>
    );
}

export default B_Home;