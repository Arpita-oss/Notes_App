import React, { useState, useRef, useEffect } from 'react';

const AudioNoteModal = ({ isOpen, onClose, AddNote }) => {
    const [isRecording, setIsRecording] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [audioLevel, setAudioLevel] = useState(0);
    const mediaRecorderRef = useRef(null);
    const audioContextRef = useRef(null);
    const analyserRef = useRef(null);
    const streamRef = useRef(null);
    const recognitionRef = useRef(null);
  
    const startRecording = () => {
      // Check for browser support
      if (!('SpeechRecognition' in window) && !('webkitSpeechRecognition' in window)) {
        alert('Your browser does not support speech recognition');
        return;
      }
  
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
          streamRef.current = stream;
          
          // Audio Context for visualization
          const AudioContext = window.AudioContext || window.webkitAudioContext;
          audioContextRef.current = new AudioContext();
          const source = audioContextRef.current.createMediaStreamSource(stream);
          
          analyserRef.current = audioContextRef.current.createAnalyser();
          source.connect(analyserRef.current);
          
          // Speech Recognition
          const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
          recognitionRef.current = new SpeechRecognition();
          recognitionRef.current.continuous = true;
          recognitionRef.current.interimResults = true;
          
          recognitionRef.current.onresult = (event) => {
            const transcriptResult = Array.from(event.results)
              .map(result => result[0].transcript)
              .join('');
            setTranscript(transcriptResult);
          };
          
          recognitionRef.current.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
          };
          
          recognitionRef.current.start();
          
          // Start recording
          mediaRecorderRef.current = new MediaRecorder(stream);
          mediaRecorderRef.current.start();
          
          setIsRecording(true);
          updateAudioLevel();
        })
        .catch(error => {
          console.error('Microphone access error:', error);
          alert('Could not access microphone. Check permissions.');
        });
    };
  
    const updateAudioLevel = () => {
      if (!analyserRef.current || !isRecording) return;
  
      const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
      analyserRef.current.getByteFrequencyData(dataArray);
      
      const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
      setAudioLevel(average / 255);
      
      if (isRecording) {
        requestAnimationFrame(updateAudioLevel);
      }
    };
  
    const stopRecording = () => {
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stop();
      }
      
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
      
      setIsRecording(false);
      setAudioLevel(0);
    };
  
    const saveAudioNote = () => {
        if (transcript.trim() && AddNote) {
          AddNote('Audio Note', transcript, null, true, transcript);
          onClose();
        }
      };
    

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-white flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96 relative border shadow-lg">
        <button 
          onClick={onClose} 
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
        >
          ✕
        </button>
        
        <h2 className="text-xl font-bold mb-4">Audio Note</h2>
        
        {/* Audio Level Indicator */}
        <div className="mb-4 h-2 bg-gray-200 rounded">
          <div 
            className="h-full bg-green-500 rounded" 
            style={{ 
              width: `${isRecording ? audioLevel * 100 : 0}%`,
              transition: 'width 0.1s ease-out'
            }}
          />
        </div>
        
        <div className="mb-4">
          <textarea 
            readOnly
            value={transcript}
            placeholder="Transcription will appear here..."
            className="w-full h-32 p-2 border rounded"
          />
        </div>
        
        <div className="flex justify-center space-x-4">
          {!isRecording ? (
            <button 
              onClick={startRecording}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Start Recording
            </button>
          ) : (
            <button 
              onClick={stopRecording}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Stop Recording
            </button>
          )}
          
          {transcript && (
            <button 
              onClick={saveAudioNote}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Save Note
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AudioNoteModal;