import { useMemo } from "react";

import useMediaQuery from "@mui/material/useMediaQuery";
import { createTheme, ThemeProvider, StyledEngineProvider, useTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

import Layout from "./Layout";

const App = () => {
    const darkMode = useMediaQuery("(prefers-color-scheme: dark)");
    const theme = useMemo(
        () =>
            createTheme({
                palette: {
                    mode: darkMode ? "dark" : "light",
                    secondary: {
                        main: "#33eb91"
                    }
                }
            }),
        [darkMode]
    );

    // const deviceTheme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));
    // console.log(isSmallScreen);

    return (
        <StyledEngineProvider injectFirst>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <Layout isSmallScreen={isSmallScreen} />
            </ThemeProvider>
        </StyledEngineProvider>
    );
};

export default App;
