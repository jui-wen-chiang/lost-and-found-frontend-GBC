import { createTheme, alpha, getContrastRatio, responsiveFontSizes } from '@mui/material/styles';
import { FontFamilyScheme, ColorScheme, BreakPointsSchem } from "src/theme/UIstandard"

let theme = createTheme({
    breakpoints: {
        values: BreakPointsSchem
    },
    // MUI will prioritize the typography settings of Theme
    typography: {
        fontSize: 16,
        // fontFamily: [
        //     'Arial',
        //     'sans-serif',
        // ].join(','),
        h1: {
            color: ColorScheme.primary.dark,
        },
        h3: {
            padding: '1.5rem 0',
            fontWeight:'bold'
        },
        h4: {
            padding: '1.5rem 0',
            color: ColorScheme.primary.dark,
        },
        h5: {
            padding: '0.4rem 0',
            color: ColorScheme.secondary.main,
        },
        subtitle2: {
            lineHeight: 2,
            fontStyle: 'oblique',
            color: ColorScheme.secondary.contrastText,
        },
        body1: {
            lineHeight: 2,
        },
        body2: {
            // fontFamily: FontFamilyScheme.secondary,
        },
        // custom styles
        stepTitle: {
            letterSpacing: '0.1rem',
        }
    },
    palette: {
        primary: {
            main: ColorScheme.primary.main,
            light: ColorScheme.primary.light,
            dark: ColorScheme.primary.dark,
            contrastText: ColorScheme.primary.contrastText,
        },
        secondary: {
            main: ColorScheme.secondary.main,
            light: ColorScheme.secondary.light,
            dark: ColorScheme.secondary.dark,
            contrastText: ColorScheme.secondary.contrastText,
        },
        text: {
            primary: ColorScheme.primary.contrastText,
            secondary: ColorScheme.secondary.contrastText,
        },
        background: {
            default: ColorScheme.neutral.light,
        },
        divider: ColorScheme.primary.light,
        // State color
        success: {
            main: ColorScheme.state.success.main,
            light: ColorScheme.state.success.light,
            dark: ColorScheme.state.success.dark,
            contrastText: ColorScheme.state.success.contrastText,
        },
        error: {
            main: ColorScheme.state.error.main,
            light: ColorScheme.state.error.light,
            dark: ColorScheme.state.error.dark,
            contrastText: ColorScheme.state.error.contrastText,
        },
        warning: {
            main: ColorScheme.state.warning.main,
            light: ColorScheme.state.warning.light,
            dark: ColorScheme.state.warning.dark,
            contrastText: ColorScheme.state.warning.contrastText,
        },
        info: {
            main: ColorScheme.state.info.main,
            light: ColorScheme.state.info.light,
            dark: ColorScheme.state.info.dark,
            contrastText: ColorScheme.state.info.contrastText,
        },
        // Custom colors
        neutral: {
            main: ColorScheme.neutral.main,
            light: ColorScheme.neutral.light,
            dark: ColorScheme.neutral.main,
            contrastText: ColorScheme.neutral.contrastText,
        }
    }
});

theme = responsiveFontSizes(theme);
export default theme;