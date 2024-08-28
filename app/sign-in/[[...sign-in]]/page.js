import {AppBar, Container, Toolbar, Typography, Button, Link, Box} from '@mui/material'
import { SignIn } from '@clerk/nextjs'

export default function SignUpPage() {
    return <Container maxWidth = "100vw">
<AppBar position = "static" sx={{backgroundColor: "#000000", p: 1}}>

    <Toolbar>
        <Typography variant ="h6" sx={{
            flexGrow: 1
        }}>
               SnapStudy - Quippler Product

        </Typography>

        <Button color = "inherit">
            <Link href = "/sign-in" passHref>
                Login
            </Link>
        </Button>

        <Button color = "inherit">
            <Link href = "/sign-up" passHref>
                Sign Up
            </Link>
        </Button>
        
    </Toolbar>
</AppBar>

    <Box
    display="flex"
    flexDirection="column"
    alignItems="center"
    justifyContent="center"
    mt={10}
    >
        <Typography variant="h4">Sign In</Typography>
        <SignIn/>
        </Box>
    </Container>


}