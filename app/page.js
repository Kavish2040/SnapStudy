'use client'
import Image from "next/image";
import getStripe from '@/utils/get-stripe' // Ensure this module exports 'getStripe' properly.
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs' // Ensure these components are exported by '@clerk/nextjs'.
import { Container, Stack, Typography, AppBar, Toolbar, Button, Box, Grid } from '@mui/material';
import Head from 'next/head'; // Ensure these are correctly exported by '@mui/material'.
import { createTheme, ThemeProvider} from '@mui/material/styles';
import { useRouter } from "next/navigation";


export default function Home() {
  const router = useRouter();
  const handleSubmit = async () => {

    const checkoutSession = await fetch('/api/checkout_session',{
      method: 'POST',
      headers:{
        origin: 'http://localhost:3000',
      },
    })
    const checkoutSessionJson = await checkoutSession.json()

    if(checkoutSession.statusCode === 500){
      console.error(checkoutSession.message)
      return
    }

    const stripe = await getStripe()
    const {error} = await stripe.redirectToCheckout({
      sessionId: checkoutSessionJson.id,
    })

    if (error){
      console.warn(error.message)
    }
  }
  
 return (
    <Container maxWidth='100vw'>
      <Head>
        <meta name="description" content = "crete flashcard from your text" />
        <title>   SnapStudy - A Quippler Product</title>
      </Head>

      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" style = {{flexGrow: 1}}>   SnapStudy - Quippler Product</Typography>
          <SignedOut>
            <Button color ="inherit" href="/sign-in"> Login</Button>
            <Button color ="inherit" href="/sign-up">Sign Up</Button>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </Toolbar>
      </AppBar>

      <Box 
      sx ={{
        textAlign: 'center', my:4
      }}>
        <Typography variant ="h2" gutterBottom> Welcome to SnapStudy
        </Typography>
        <Typography variant ="h5" gutterBottom>
          {' '}
        Easiest way to make flashcards from your text
        </Typography>
        <Button variant = "contained" color="primary" sx={{mt:2}} href="/generate" >
        Get Started
        </Button>
      </Box>
      <Box sx ={{
        my: 6}}>
          <Typography variant ="h4" gutterBottom>
          Features
          </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Typography variant ="h6" gutterBottom>
              Easy text imput
            </Typography>
            <Typography> {' '}Simply input your text and let our software do the rest. Creating flashcards has never been easier</Typography>
            </Grid> 
            <Grid item xs = {12} md={4}>
            <Typography variant ="h6" gutterBottom>
              Smart Flashcards
            </Typography>
            Generate flashcards in seconds using AI technology. Share your flashcards with friends or classmates.
            <Typography>
              {' '}
             </Typography>
            </Grid> 
            <Grid item xs = {12} md ={4}>
            <Typography variant ="h6" gutterBottom>
              Accessible Anywhere 
            </Typography>
            <Typography>
              {' '}
             Access your flashcards from any device, at any time. Study on the go with ease 
              </Typography>
            </Grid> 
        </Grid>


      </Box>

      <Box sx={{my:6, textAlign: 'center'}}>
      
      <Typography variant = "h4" gutterBottom> Pricing </Typography>

      <Grid container spacing={4}>
          <Grid item xs={12} md={6}>

         <Box sx={{
          p: 3,
          border: '1px solid',
          borderColor: 'grey.300',
          borderRadius: 2,
         }}>

            <Typography variant ="h5" gutterBottom>
              Basic
            </Typography>
            <Typography variant ="h6" gutterBottom>
              $0 / month</Typography>
            <Typography> {' '}Access basic flashcard features and limited storage</Typography>
            <Button variant ="contained" color = "primary" sx={{mt: 2}}>Choose Basic</Button>
            </Box>
            </Grid> 
          
            <Grid item xs={12} md={6}>
            <Box sx={{
          p: 3,
          border: '1px solid',
          borderColor: 'grey.300',
          borderRadius: 2,
         }}>

            <Typography variant ="h5" gutterBottom>
              Pro
            </Typography>
            <Typography variant ="h6" gutterBottom>
              $10 / month</Typography>
            <Typography> {' '}Access to unlimited flashcard features and unlimited storage and priority support</Typography>
            <Button variant ="contained" color = "primary" sx={{mt: 2}} onClick={handleSubmit}>Choose Pro</Button>
            </Box>
            </Grid>
        </Grid>


      </Box>
    </Container>
  )
}
