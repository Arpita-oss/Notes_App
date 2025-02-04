import React, { useState } from 'react';
import Navbar from '../assets/components/Navbar';
import NoteModal from '../assets/components/NoteModal';

const Home = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const onClose = ()=>{
    setModalOpen(false)
  }

   const AddNote = async (title,description,image) => {
      e.preventDefault();
      try {
        const response = await axios.post("http://localhost:5000/api/note/add", {title,description,image}, {
          headers: { "Content-Type": "application/json" }, // ✅ Ensure correct JSON headers
        });
    
        if (response.data && response.data.token) {
          onClose()
        } else {
          console.error("Login failed: No token received");
        }
      } catch (error) {
          
        console.error("Error:", error.response?.data || error.message); // More detailed error logging
      }
    };
  


  return (
    <div>
      <Navbar />
      <button
        onClick={() => setModalOpen(true)}
        className='fixed right-4 bottom-4 text-2xl bg-teal-500 text-white font-bold p-4 rounded-full'
      >
        +
      </button>
      <NoteModal 
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onAddNote={AddNote}
      />
    </div>
  );

}
export default Home;