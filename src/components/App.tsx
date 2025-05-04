import { useMemo } from "react";

import useMediaQuery from "@mui/material/useMediaQuery";
import { createTheme, ThemeProvider, StyledEngineProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { grey } from "@mui/material/colors";

import Layout from "./Layout";

declare module "@mui/material/styles" {
	interface Palette {
        neutral: Palette["primary"];
    }
    interface PaletteOptions {
        neutral: PaletteOptions["primary"];
    }

	interface PaletteColor {
        medium?: string;
		mediumDark?: string;
    }
    interface SimplePaletteColorOptions {
        medium?: string;
		mediumDark?: string;
    }
}

  

const App = () => {
    const darkMode = useMediaQuery("(prefers-color-scheme: dark)");
    const theme = useMemo(
        () =>
            createTheme({
                palette: {
                    mode: darkMode ? "dark" : "light",
                    secondary: {
                        main: "#33eb91",
                        light: "#5befa7",
                        dark: "#23a465"
                    },
                    neutral: {
                        main: "#9e9e9e",
                        light: grey[50]
                    }
                }
            }),
        [darkMode]
    );

    const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
    const isMediumScreen = useMediaQuery(theme.breakpoints.down("md"));

    return (
        <StyledEngineProvider injectFirst>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <Layout isSmallScreen={isSmallScreen} isMediumScreen={isMediumScreen} />
            </ThemeProvider>
        </StyledEngineProvider>
    );
};

export default App;
