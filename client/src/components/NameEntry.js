import React, { useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  MenuItem,
  CircularProgress,
  Alert,
  FormControl,
  InputLabel,
  Select,
  IconButton,
  Paper,
  Tooltip,
  Fade,
  Snackbar
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import MicIcon from '@mui/icons-material/Mic';
import StopIcon from '@mui/icons-material/Stop';
import SearchIcon from '@mui/icons-material/Search';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';

const NameEntry = () => {
  const [formData, setFormData] = useState({
    originalName: '',
    role: 'suspect',
    caseNumber: '',
    stationId: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingStatus, setRecordingStatus] = useState('');
  const [language, setLanguage] = useState('hi-IN');
  const [searchResults, setSearchResults] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const showNotification = (message) => {
    setSnackbarMessage(message);
    setSnackbarOpen(true);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          channelCount: 1,
          sampleRate: 16000,
          sampleSize: 16,
          volume: 1
        }
      });
      
      mediaRecorderRef.current = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });
      
      chunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
        stream.getTracks().forEach(track => track.stop());
        
        try {
          setLoading(true);
          setRecordingStatus('Processing voice...');
          
          const formData = new FormData();
          formData.append('audio', audioBlob, 'recording.webm');
          formData.append('language', language);

          const response = await axios.post('http://localhost:5001/process_voice', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });

          if (response.data.recognized_text) {
            setFormData(prev => ({
              ...prev,
              originalName: response.data.recognized_text
            }));
            showNotification('Voice recognized: ' + response.data.recognized_text);
            
            // Use the dedicated voice search endpoint
            const searchResponse = await axios.post('http://localhost:3001/api/names/voice-search', {
              recognizedText: response.data.recognized_text,
              language: language
            });
            
            setSearchResults(searchResponse.data.results);
          }
        } catch (error) {
          console.error('Error processing voice:', error);
          setError(error.response?.data?.error || 'Error processing voice input');
          showNotification('Error processing voice. Please try again.');
        } finally {
          setLoading(false);
          setRecordingStatus('');
        }
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      setRecordingStatus('Recording...');
      showNotification('Recording started');
    } catch (err) {
      console.error('Error accessing microphone:', err);
      setError('Microphone access denied. Please check your browser settings.');
      showNotification('Error accessing microphone. Please check permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setRecordingStatus('Processing voice...');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await axios.post('http://localhost:5000/api/names', {
        originalName: formData.originalName,
        role: formData.role,
        caseNumber: formData.caseNumber
      });
      setSuccess(true);
      showNotification('Record saved successfully!');
      setFormData({
        originalName: '',
        role: 'suspect',
        caseNumber: '',
        stationId: ''
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Error saving record');
      showNotification('Error saving record');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Police Records Entry
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Record saved successfully!
          </Alert>
        )}

        <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Voice Search
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <FormControl sx={{ minWidth: 120 }}>
              <InputLabel>Language</InputLabel>
              <Select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                size="small"
              >
                <MenuItem value="hi-IN">Hindi</MenuItem>
                <MenuItem value="en-IN">English</MenuItem>
              </Select>
            </FormControl>

            <Tooltip title={isRecording ? "Stop Recording" : "Start Voice Search"}>
              <IconButton
                color={isRecording ? "secondary" : "primary"}
                onClick={isRecording ? stopRecording : startRecording}
                disabled={loading}
              >
                {isRecording ? <StopIcon /> : <MicIcon />}
              </IconButton>
            </Tooltip>

            {recordingStatus && (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ 
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}
              >
                <VolumeUpIcon fontSize="small" />
                {recordingStatus}
              </Typography>
            )}
          </Box>
        </Paper>

        <form onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <TextField
              required
              label="Name"
              value={formData.originalName}
              onChange={(e) => setFormData({ ...formData, originalName: e.target.value })}
              fullWidth
              InputProps={{
                endAdornment: (
                  <IconButton
                    onClick={async () => {
                      try {
                        setLoading(true);
                        const response = await axios.get(`http://localhost:3001/api/names/search?query=${formData.originalName}`);
                        setSearchResults(response.data);
                        showNotification(`Found ${response.data.length} results`);
                      } catch (error) {
                        setError('Error searching records');
                      } finally {
                        setLoading(false);
                      }
                    }}
                  >
                    <SearchIcon />
                  </IconButton>
                )
              }}
            />

            <TextField
              select
              label="Role"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              fullWidth
            >
              <MenuItem value="suspect">Suspect</MenuItem>
              <MenuItem value="victim">Victim</MenuItem>
              <MenuItem value="witness">Witness</MenuItem>
            </TextField>

            <TextField
              required
              label="Station ID"
              value={formData.stationId}
              onChange={(e) => setFormData({ ...formData, stationId: e.target.value })}
              fullWidth
            />

            <TextField
              required
              label="Case Number"
              value={formData.caseNumber}
              onChange={(e) => setFormData({ ...formData, caseNumber: e.target.value })}
              fullWidth
            />

            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
            >
              Save Record
            </Button>
          </Box>
        </form>

        {searchResults.length > 0 && (
          <Paper elevation={3} sx={{ mt: 3, p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Search Results
            </Typography>
            {searchResults.map((result, index) => (
              <Box key={index} sx={{ mb: 2, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
                <Typography variant="subtitle1">
                  Name: {result.originalName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Role: {result.role} | Station ID: {result.stationId} | Case Number: {result.caseNumber}
                </Typography>
              </Box>
            ))}
          </Paper>
        )}
      </Box>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        TransitionComponent={Fade}
        message={snackbarMessage}
      />
    </Container>
  );
};

export default NameEntry;