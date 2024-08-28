"use client";
import { Container, Grid, Card, Box, Typography, Paper, TextField, Button, CardActionArea, CardContent, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { db } from '@/firebase';
import { doc, collection, writeBatch, getDoc } from 'firebase/firestore';
import Tesseract from 'tesseract.js';

export default function Generate() {
    const { user } = useUser();
    const [flashcards, setFlashcards] = useState([]);
    const [flipped, setFlipped] = useState([]);
    const [text, setText] = useState('');
    const [imageBase64, setImageBase64] = useState('');
    const [name, setName] = useState('');
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onloadend = () => {
            setImageBase64(reader.result);
            setText(''); // Clear text input when image is loaded
        };
        reader.onerror = () => {
            console.error('Error reading file');
            alert('Failed to read file. Please try again.');
        };
        if (file) {
            reader.readAsDataURL(file);
        }
    };

    const handleTextChange = (event) => {
        setText(event.target.value);
        setImageBase64(''); // Clear image input when text is entered
    };

    const handleSubmit = async () => {
        setLoading(true);
        let finalText = text;

        if (imageBase64) {
            try {
                // Convert the image to text using Tesseract.js
                const result = await Tesseract.recognize(imageBase64, 'eng', {
                    logger: (m) => console.log(m), // Log progress
                });
                finalText = result.data.text;
            } catch (error) {
                console.error('Error extracting text from image:', error);
                alert('Failed to extract text from image. Please try again.');
                setLoading(false);
                return;
            }
        }

        const bodyContent = { text: finalText };
        console.log('Sending request with:', bodyContent);

        fetch('/api/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(bodyContent),
        })
        .then(res => {
            if (!res.ok) {
                throw new Error(`HTTP error status: ${res.status}`);
            }
            return res.json();
        })
        .then(data => {
            setFlashcards(data);
            setLoading(false);
        })
        .catch(error => {
            console.error('Error fetching flashcards:', error);
            setLoading(false);
        });
    };

    const handleCardClick = (id) => {
        setFlipped((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const saveFlashcards = async () => {
        if (!name) {
            alert('Please enter a name for the flashcards collection');
            return;
        }

        const batch = writeBatch(db);
        const userDocRef = doc(collection(db, 'users'), user.id);
        const docSnap = await getDoc(userDocRef);

        if (docSnap.exists()) {
            const collections = docSnap.data().flashcards || [];
            if (collections.find((f) => f.name === name)) {
                alert("Flashcard collection with the same name already exists.");
                return;
            }
            collections.push({ name });
            batch.set(userDocRef, { flashcards: collections }, { merge: true });
        } else {
            batch.set(userDocRef, { flashcards: [{ name }] });
        }

        const colRef = collection(userDocRef, name);
        flashcards.forEach((flashcard, index) => {
            const cardDocRef = doc(colRef, `card${index}`);
            batch.set(cardDocRef, flashcard);
        });

        await batch.commit();
        handleClose();
        router.push('/flashcards');
    };

    return (
        <Container maxWidth="md">
            <Box sx={{ mt: 4, mb: 6, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography variant="h4">Generate Flashcards</Typography>
                <Paper sx={{ p: 4, width: '100%' }}>
                    <TextField
                        value={text}
                        onChange={handleTextChange}
                        label="Enter Text"
                        fullWidth
                        multiline
                        rows={4}
                        variant="outlined"
                        sx={{ mb: 2 }}
                        disabled={!!imageBase64}
                    />
                    <input
                        type="file"
                        onChange={handleImageChange}
                        accept="image/*"
                        style={{ display: 'block', marginBottom: 20 }}
                        disabled={!!text}
                    />
                    <Button variant="contained" color="primary" onClick={handleSubmit} fullWidth disabled={loading}>
                        {loading ? 'Processing...' : 'Submit'}
                    </Button>
                </Paper>
            </Box>

            {flashcards.length > 0 && (
                <Box sx={{ mt: 4 }}>
                    <Typography variant="h5">Flashcards Preview</Typography>
                    <Grid container spacing={3}>
                        {flashcards.map((flashcard, index) => (
                            <Grid item xs={12} sm={6} md={4} key={index}>
                                <Card>
                                    <CardActionArea onClick={() => handleCardClick(index)}>
                                        <CardContent>
                                            <Box sx={{
                                                perspective: '1000px',
                                                '& > div': {
                                                    transition: 'transform 0.6s',
                                                    transformStyle: 'preserve-3d',
                                                    position: 'relative',
                                                    width: '100%',
                                                    height: '270px',
                                                    boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)',
                                                    transform: flipped[index] ? 'rotateY(180deg)' : 'rotateY(0deg)',
                                                },
                                                '& > div > div': {
                                                    position: 'absolute',
                                                    width: '100%',
                                                    height: '100%',
                                                    backfaceVisibility: 'hidden',
                                                    display: 'flex',
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                    padding: 2,
                                                    boxSizing: 'border-box',
                                                },
                                                '& > div > div: nth-of-type(2)': {
                                                    transform: 'rotateY(180deg)',
                                                },
                                            }}>
                                                <div>
                                                    <div>
                                                        <Typography variant="h5" component="div">
                                                            {flashcard.front}
                                                        </Typography>
                                                    </div>
                                                    <div>
                                                        <Typography variant="h6" component="div">
                                                            {flashcard.back}
                                                        </Typography>
                                                    </div>
                                                </div>
                                            </Box>
                                        </CardContent>
                                    </CardActionArea>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                    <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
                        <Button variant='contained' color='secondary' onClick={handleOpen}>
                            Save
                        </Button>
                    </Box>
                </Box>
            )}
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Save Flashcards</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Please enter a name for your flashcards collection
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin='dense'
                        label="Collection Name" type="text" fullWidth value={name} onChange={(e) => setName(e.target.value)}
                        variant="outlined"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={saveFlashcards}>Save</Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
}
