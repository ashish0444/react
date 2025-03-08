import React from 'react'
import ChatPanel from './ChatPanel';
import ChatWindow from './ChatWindow';

function Home() {
  return (
    <main className='relative w-full h-screen bg-[#E3E1DB]'>
      <div className="absolute top-0 h-[130px] bg-[#04a784] w-full" />
      <div className='h-screen absolute w-full p-5'>
        <div className="bg-[#eff2f5] w-full h-full shadow-md flex">
         
          <ChatPanel />
          
          <ChatWindow />
        </div>
      </div>
    </main>
  );
}

export default Home;
