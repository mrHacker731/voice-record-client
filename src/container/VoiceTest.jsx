import React, { useState, useRef, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import LogoutButton from "./Logout";
import "../App.css";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import ErrorComponent from "./ErrorComponent";

export const BASE_URL = "https://voice-recording-server.onrender.com/api/v1";

const VoiceTest = () => {
  const [recording, setRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [recordings, setRecordings] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const mediaRecorder = useRef(null);
  
  const mediaStream = useRef(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      navigate('/login');
    } else {
      fetchRecordings();
    }
  }, [navigate]);

  const fetchRecordings = async () => {
    try {
      const response = await axiosInstance.get(`${BASE_URL}/get/recording`);
      setRecordings(response.data.recordings);
    } catch (error) {
      //   console.error('Error fetching recordings:', error);
      setErrorMessage("Error fetching recordings.");
      // Set timeout to clear the error message after 2 seconds
      setTimeout(() => {
        setErrorMessage("");
      }, 2000);
    }
  };

  const requestMicrophoneAccess = () => {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        mediaStream.current = stream;
        mediaRecorder.current = new MediaRecorder(stream);
        mediaRecorder.current.ondataavailable = (e) => {
          setAudioBlob(e.data);
          const url = URL.createObjectURL(e.data);
          setAudioUrl(url);
        };
        mediaRecorder.current.start();
        setRecording(true);
        setErrorMessage("");
      })
      .catch(() => {
        // console.error("Error accessing microphone:", err);
        setErrorMessage(
          "Microphone access denied. Please allow microphone access to record."
        );
        setTimeout(() => {
          setErrorMessage("");
        }, 2000);
      });
  };

  const startRecording = () => {
    if (errorMessage) {
      setErrorMessage(
        "Microphone access denied. Please check your browser settings to allow microphone access."
      );
      setTimeout(() => {
        setErrorMessage("");
      }, 2000);
    } else {
      requestMicrophoneAccess();
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current) {
      mediaRecorder.current.stop();
      setRecording(false);

      if (mediaStream.current) {
        mediaStream.current.getTracks().forEach((track) => track.stop());
        mediaStream.current = null;
      }
    }
  };

  const saveRecording = async () => {
    setSaving(true);
    const formData = new FormData();
    formData.append("voice", audioBlob, `${uuidv4()}.webm`);

    try {
      const response = await axiosInstance.post(
        `${BASE_URL}/upload/recording`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // console.log("Success:", response.data);
      fetchRecordings();
      setAudioBlob(null);
      setAudioUrl(null);
    } catch (error) {
      //   console.error('Error saving recording:', error);
      setErrorMessage("Error saving recording.");
      setTimeout(() => {
        setErrorMessage("");
      }, 2000);
    } finally {
      setSaving(false);
    }
  };

  const deleteRecording = async (id) => {
    setDeleting(id);
    try {
      await axiosInstance.delete(`${BASE_URL}/delete/recording/${id}`);
      setRecordings((prevRecordings) =>
        prevRecordings.filter((recording) => recording._id !== id)
      );
      setErrorMessage("");
    } catch (error) {
      //   console.error('Error deleting recording:', error);
      setErrorMessage("Error deleting recording.");
      setTimeout(() => {
        setErrorMessage("");
      }, 2000);
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="app-container">
      <LogoutButton/>
      <h1>Voice Recording App</h1>
      <ErrorComponent message={errorMessage}/>
      <button onClick={recording ? stopRecording : startRecording}>
        {recording ? "Stop Recording" : "Start Recording"}
      </button>

      {audioUrl && (
  <div className="preview-container">
    <h3>Preview Recording</h3>
    <div style={{ display: 'flex', flexDirection: 'column', marginTop: '20px' }}>
      <div style={{ textAlign: 'center',marginTop: '10px' }}>
        <audio controls src={audioUrl}></audio>
      </div>
      <div style={{marginTop: '15px'}}>
        <button style={{ marginRight: '10px' }} onClick={saveRecording} disabled={saving}>
          {saving ? 'Saving...' : 'Save Recording'}
        </button>
        <button onClick={() => setAudioUrl(null)}>Delete Recording</button>
      </div>
    </div>
  </div>
)}


<h2>Recordings</h2>
      <ul style={{ listStyleType: "none", display:'flex',flexDirection:'column',gap:'20px', padding: 0 ,marginLeft:'20px'}}>
        {recordings.map((recording) => (
          <li
            key={recording._id}
            style={{ display: "inline-block", marginRight: "10px" }}
          >
            <audio controls style={{ verticalAlign: "middle" }}>
              <source src={recording.filepath} type="audio/mpeg" />
            </audio>
            <button
              className={`delete-button ${
                deleting === recording._id ? "deleting" : ""
              }`}
              onClick={() => deleteRecording(recording._id)}
              disabled={deleting === recording._id}
              style={{ verticalAlign: "middle", marginLeft: "15px" }}
            >
              {deleting === recording._id ? "Deleting..." : "Delete"}
            </button>
          </li>
        ))}
      </ul>

       

    </div>
  );
};

export default VoiceTest;
