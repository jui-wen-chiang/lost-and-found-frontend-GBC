import * as React from 'react';
// theme
import { ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from '@mui/material';
import theme from './theme/index';
// views & Router
import { BrowserRouter as Router } from "react-router-dom";
// import Appbar from './components/tools/Bars/MyAppBar.tsx';
import TestView from "src/views/TestView";
// style
import { Container, Box } from "src/components/mui/components";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import '@xyflow/react/dist/style.css';
import { useState, useEffect } from 'react';
//import { displayPartsToString } from 'typescript';

// Use basename only in production. Please do not delete yet.
// const basename = import.meta.env.PROD ? '/lost-and-found-gbc' : '/';

function AppLayout() {
    return (
        <Container>
            {/* <Box>
                <Appbar />
            </Box> */}
            <Box>
                <TestView />
            </Box>
        </Container>
    );
}

export default function App() {
    return (
        <ThemeProvider theme={theme} >
            <CssBaseline />
            {/* <Router basename={basename}></Router> */}
            <Router>
                <AppLayout />
            </Router>
        </ThemeProvider>
    );
}