import React from 'react';
import logo from './assets/images/logo.svg';
// import InGameUserProfile from './components/Pong/InGameUserProfile';
import './assets/css/App.css';
import ChatLadderSwitch from './components/Chat/ChatLaddeerSwitch';

const App: React.FC = () => {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        {/* <section className="componentes" style={{ position: 'absolute', top: 120, right: 1500, display: 'flex', alignItems: 'center' }}>
          <InGameUserProfile name="Alex" image='https://i.imgur.com/yXOvdOSs.jpg' rank={10} />
        </section> */}
        {/*Ajustar componentes a la ventana*/}
        <section className="ChatLadder" style={{ position: 'absolute', top: '10%', right: '5%', display: 'flex', alignItems: 'flex-end' }}>
          <ChatLadderSwitch></ChatLadderSwitch>
        </section>
      </header>
    </div>
  );
};


export default App;
