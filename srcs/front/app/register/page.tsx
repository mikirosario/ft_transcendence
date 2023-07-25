'use client'

import UserSettingsButtons from "@/components/UserSettingsButton";
import { Press_Start_2P } from "next/font/google";
import { useEffect, useState } from "react";

const PS2P = Press_Start_2P({
    subsets: ['latin'],
    weight: '400'
  });

// const hasValidToken = async () => {
//     const token = localStorage.getItem('token');
//     if (token) {
//       try {
//         await getUserProfile();
//         return true;
//       } catch (error) {
//         return false;
//       }
//     }
//     return false;
//   };

export default function Register() {
    const [ready, setReady] = useState(false);
    // const [searchParams, setSearchParams] = useSearchParams();

    // useEffect(() => {
    //     if (searchParams.has("token")) {
    //         const token = searchParams.get("token");
    //         if (token) {
    //             localStorage.setItem('token', token);
    //             searchParams.delete("token");
    //             setSearchParams(searchParams);
    //             setReady(true);
    //         }
    //     } else {
    //         setReady(true);
    //     }
    // }, [searchParams, setSearchParams]);

    // useEffect(() => {
    //     const handlePopState = async () => {
    //       const isValid = await hasValidToken();
    //       if (!isValid) {
    //         window.location.replace("/");
    //       }
    //     };

    //     window.addEventListener('popstate', handlePopState);

    //     // Asegurarte de limpiar el evento al desmontar el componente
    //     return () => {
    //       window.removeEventListener('popstate', handlePopState);
    //     };
    //   }, []);

    const NicknamePositionStyle: React.CSSProperties = {
        height: '320px',
        width: '100%',
        top: '320px',
        backgroundColor: '#01624',
    };

    const NicknameTapeStyle: React.CSSProperties = {
        height: '170%',
        width: '100%',
        top: '50%',
        backgroundColor: '#1c2c49',
        position: 'relative',
    };

    const TitleStyle: React.CSSProperties = {
        color: '#ffffff',
        fontFamily: "'Press Start 2P'",
        fontSize: '40px',
        top: '8%',
        width: '100%',
        textAlign: 'center',
        position: 'absolute',
        left: '0%',
    };

    const SubtitleStyle: React.CSSProperties = {
        color: '#ffffff',
        fontFamily: "'Press Start 2P'",
        fontSize: '20px',
        top: '22%',
        width: '100%',
        textAlign: 'center',
        position: 'absolute',
        left: '0%',

    };

    const NicknameInputStyle: React.CSSProperties = {
        height: '58%',
        width: '40%',
        left: '28%',
        top: '40%',
        position: 'relative',
    };

    return (
        <div style={NicknamePositionStyle}>
            <div style={NicknameTapeStyle}>
                <div className={PS2P.className}  style={TitleStyle}>CHOOSE A NICKNAME</div>
                <div className={PS2P.className}  style={SubtitleStyle}>Nick rules</div>
                <div style={NicknameInputStyle}>
                    <section>
                        <UserSettingsButtons btnTxt="Register"></UserSettingsButtons>
                    </section>
                </div>
            </div>
        </div>
        // : <div>Loading...</div> // Mostrar algún spinner de carga o mensaje.
    );
}