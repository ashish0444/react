import React from 'react'
import { storage } from "../firebase";
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import ChatPanel from './ChatPanel';
import ChatWindow from './ChatWindow';

function Home() {
  return (
    <main style={{ position: 'relative', width: '100%', height: '100vh', backgroundColor: '#E3E1DB' }}>
      <div style={{ position: 'absolute', top: 0, height: '130px', width: '100%', backgroundColor: '#4F46E5' }} />
      
      <div style={{ position: 'absolute', padding: '20px', top: 0, height: '100vh', width: '100%' }}>
        <div style={{ backgroundColor: '#F3F4F6', width: '100%', height: '100%', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', display: 'flex' }}>
          <ChatPanel />
          <ChatWindow />
        </div>
      </div>
    </main>
  );
}

export default Home;