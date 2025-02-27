import React, { useState } from 'react';
import axios from 'axios';

const NoteDetailModal = ({ note, onClose, onUpdate }) => {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedNote, setEditedNote] = useState({
    title: note.title,
    description: note.description,
    image: note.image
  });
  const [selectedImage, setSelectedImage] = useState(null);

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem('token');

      // Fix the API endpoint URL to match your backend route
      const response = await axios.put(
        `https://notes-app-1-3vhl.onrender.com/api/note/${note._id}`,  // Changed from /api/notes to match your backend
        {
          title: editedNote.title,
          description: editedNote.description,
          image: editedNote.image
        },
        {
          headers: {
            'Authorization': token,  // Remove 'Bearer ' prefix if not required by your backend
            'Content-Type': 'application/json'  // Changed from multipart/form-data since we're not handling file upload here
          }
        }
      );

      if (response.data.success) {
        onUpdate(response.data.note);
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Update failed:', error);
      // Add error handling UI feedback here if needed
    }
  };

  const handleToggleFavorite = async () => {
    try {
      const token = localStorage.getItem('token');
      // Fix the API endpoint URL
      const response = await axios.put(
        `http://:5000/api/note/toggle-favorite/${note._id}`,
        {},
        {
          headers: {
            'Authorization': token  // Remove 'Bearer ' since your token already includes it
          }
        }
      );

      if (response.data.success) {
        // Update the note with the new favorite status
        onUpdate({ ...note, isFavorite: !note.isFavorite });
      }
    } catch (error) {
      console.error('Toggle favorite failed:', error);
      // Add user feedback for errors
      alert('Failed to update favorite status');
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setSelectedImage(file);
    setEditedNote(prev => ({
      ...prev,
      image: URL.createObjectURL(file)
    }));
  };

  return (

    <div
      className={`fixed inset-0 z-50 flex items-center justify-center backdrop-blur
    ${isFullScreen ? 'w-full h-full' : 'bg-black-400 bg-opacity-30'}`}
    >
      <div
        className={`bg-white rounded-lg shadow-xl p-6 
      ${isFullScreen ? 'w-full h-full' : 'w-11/12 max-w-2xl max-h-[90vh]'} 
      overflow-auto relative`}
      >
        {/* Header Buttons */}
        <div className="absolute top-4 right-4 flex space-x-2">
          <button
            onClick={() => setIsFullScreen(!isFullScreen)}
            className="bg-gray-200 p-2 rounded-full"
          >
            {isFullScreen ? '↙️' : '↗️'}
          </button>
          <button
            onClick={onClose}
            className="bg-red-200 p-2 rounded-full"
          >
            ✕
          </button>
        </div>

        {/* Note Content */}
        {isEditing ? (
          <div>
            <input
              value={editedNote.title}
              onChange={(e) => setEditedNote({ ...editedNote, title: e.target.value })}
              className="w-full border p-2 mb-4"
            />
            <textarea
              value={editedNote.description}
              onChange={(e) => setEditedNote({ ...editedNote, description: e.target.value })}
              className="w-full border p-2 mb-4 h-40"
            />
            <input
              type="file"
              onChange={handleImageUpload}
              accept="image/*"
            />
            {editedNote.image && (
              <img
                src={editedNote.image}
                alt="Note"
                className="w-full h-48 object-cover mt-4"
              />
            )}
            <div className="flex justify-end space-x-2 mt-4">
              <button
                onClick={handleUpdate}
                className="bg-green-500 text-white px-4 py-2 rounded"
              >
                Save
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="bg-gray-200 px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-bold mb-4">{note.title}</h2>

            {note.image && (
              <img
                src={note.image}
                alt="Note"
                className="w-full h-64 object-cover mb-4 rounded"
              />
            )}

            <p className="mb-4">{note.description}</p>

            {note.isAudioNote && note.audioTranscription && (
              <div className="bg-gray-100 p-4 rounded">
                <h3 className="font-semibold mb-2">Audio Transcription:</h3>
                <p>{note.audioTranscription}</p>
              </div>
            )}

            <div className="flex justify-between mt-4">
              <button
                onClick={() => setIsEditing(true)}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Edit
              </button>
              <button
                onClick={handleToggleFavorite}
                className={`px-4 py-2 rounded ${note.isFavorite ? 'bg-red-500 text-white' : 'bg-gray-200'
                  }`}
              >
                {note.isFavorite ? '❤️ Favorited' : '🤍 Add to Favorites'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>

  );
};

export default NoteDetailModal;