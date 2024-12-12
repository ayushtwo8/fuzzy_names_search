import React, { useState, useRef } from 'react';
import axios from 'axios';
import { 
    TextField, 
    Button, 
    IconButton, 
    Select, 
    MenuItem, 
    FormControl, 
    InputLabel,
    Snackbar,
    CircularProgress,
    Container,
    Typography,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Box,
    Alert
} from '@mui/material';
import MicIcon from '@mui/icons-material/Mic';
import StopIcon from '@mui/icons-material/Stop';
import SearchIcon from '@mui/icons-material/Search';

const NameSearch = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [language, setLanguage] = useState('hi-IN');
    const [isRecording, setIsRecording] = useState(false);
    const [recordingStatus, setRecordingStatus] = useState('');
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    const mediaRecorderRef = useRef(null);
    const chunksRef = useRef([]);

    const showNotification = (message) => {
        setSnackbarMessage(message);
        setSnackbarOpen(true);
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
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
                        setSearchQuery(response.data.recognized_text);
                        showNotification('Voice recognized: ' + response.data.recognized_text);
                        
                        // Use the dedicated voice search endpoint
                        const searchResponse = await axios.post('http://localhost:5000/api/names/voice-search', {
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
        }
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;

        try {
            setLoading(true);
            setError('');
            const response = await axios.get(`http://localhost:5000/api/names/search?query=${searchQuery}`);
            setSearchResults(response.data);
        } catch (error) {
            console.error('Search error:', error);
            setError('Error performing search. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom align="center" color="primary">
                Search Police Records
            </Typography>
            
            <Paper component="form" onSubmit={handleSearch} sx={{ p: 4, mb: 4 }}>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <FormControl variant="outlined" style={{ minWidth: 120, marginRight: '1rem' }}>
                        <InputLabel>Language</InputLabel>
                        <Select
                            value={language}
                            onChange={(e) => setLanguage(e.target.value)}
                            label="Language"
                        >
                            <MenuItem value="hi-IN">Hindi</MenuItem>
                            <MenuItem value="en-IN">English</MenuItem>
                        </Select>
                    </FormControl>

                    <TextField
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Enter name to search..."
                        variant="outlined"
                        fullWidth
                        style={{ marginRight: '1rem' }}
                    />

                    <IconButton 
                        onClick={isRecording ? stopRecording : startRecording}
                        color={isRecording ? "secondary" : "primary"}
                        disabled={loading}
                    >
                        {isRecording ? <StopIcon /> : <MicIcon />}
                    </IconButton>

                    <Button 
                        type="submit" 
                        variant="contained" 
                        color="primary"
                        disabled={loading || !searchQuery.trim()}
                        startIcon={loading ? <CircularProgress size={20} /> : <SearchIcon />}
                    >
                        {loading ? 'Searching...' : 'Search'}
                    </Button>
                </Box>
            </Paper>

            {recordingStatus && (
                <div className="recording-status">
                    {recordingStatus}
                </div>
            )}

            {loading && (
                <div className="loading-indicator">
                    <CircularProgress size={24} />
                </div>
            )}

            {error && (
                <div className="error-message">
                    <Alert severity="error">{error}</Alert>
                </div>
            )}

            {searchResults.length > 0 && (
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="search results">
                        <TableHead>
                            <TableRow>
                                <TableCell>Case Number</TableCell>
                                <TableCell>Original Name</TableCell>
                                <TableCell>Romanized Name</TableCell>
                                <TableCell>Role</TableCell>
                                <TableCell>Date Added</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {searchResults.map((record) => (
                                <TableRow
                                    key={record.id || record._id || `${record.caseNumber}-${record.romanizedName}`}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell>{record.caseNumber}</TableCell>
                                    <TableCell>{record.originalName}</TableCell>
                                    <TableCell>{record.romanizedName}</TableCell>
                                    <TableCell sx={{ textTransform: 'capitalize' }}>{record.role}</TableCell>
                                    <TableCell>
                                        {new Date(record.dateAdded).toLocaleDateString()}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            {searchResults.length === 0 && searchQuery && !loading && (
                <Alert severity="info">No results found.</Alert>
            )}

            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
                message={snackbarMessage}
            />
        </Container>
    );
};

export default NameSearch;
