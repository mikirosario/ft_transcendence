import React from "react";
import '../assets/css/Home.css';
import PlayButton from "../components/Main/PlayButton";

function Home() {
    return (
    <h1>this is the homepage

        <section className='PlayButton'>
            <PlayButton></PlayButton>
        </section>
    </h1>
    );
}

export default Home;