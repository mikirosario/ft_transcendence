import React, { useEffect } from "react";
import Link from "next/link";
import '../../styles/globals.css';

import HomeButton from '../../components/HomeButton'
import { useContext } from 'react';
// import { SocketProvider1,SocketProvider2 } from "../SocketContext";

export default function HomePage () {
    // const location = useLocation();

    // useEffect(() => {
    //     return () => {
    //       if (location.pathname === "/register") {
    //         navigate('/homepage');
    //       }
    //     };
    //   }, [location, navigate]);

    const Content: React.CSSProperties = {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        margin: '0px 100px',
        gap: '100px',
    }

    return (
        <div style={Content}>
            <Link href={"/menu/gameSelector"}>
                <button>INVITE</button>
            </Link>
            <Link href={"/menu/gameSelector"}>
                <button>PLAY</button>
            </Link>
        </div>
    );
}