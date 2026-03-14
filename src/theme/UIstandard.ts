// MUI v5 default break points
const BreakPointsSchem = {
    xs: 0,
    sm: 600,    // phones
    md: 900,    // tablets
    lg: 1200,   // desktop
    xl: 1536,   // large desktop
};

// import google fonts in public/index.html via <link>
const FontFamilyScheme: { [key: string]: string } = {
    signature: "Hurricane, sans-serif",
    primary: "DM Serif Display, serif",
    secondary: "Proza Libre, sans-serif"
};

// MUI v5 default typography
const FontSizeScheme: { [key: string]: any } = {
    h1: {
        fontSize: "6.0rem",
        fontWeight: 300,
        lineHeight: 1.167,
    },
    h2: {
        fontSize: "3.75rem",
        fontWeight: 300,
        lineHeight: 1.2,
    },
    h3: {
        fontSize: "3.0rem",
        fontWeight: 400,
        lineHeight: 1.167,
    },
    h4: {
        fontSize: "2.125rem",
        fontWeight: 400,
        lineHeight: 1.235,
    },
    h5: {
        fontSize: "1.5rem",
        fontWeight: 400,
        lineHeight: 1.334,
    },
    h6: {
        fontSize: "1.25rem",
        fontWeight: 500,
        lineHeight: 1.6,
    },
    subtitle1: {
        fontSize: "1.0rem",
        fontWeight: 400,
        lineHeight: 1.75,
    },
    subtitle2: {
        fontSize: "0.875rem",
        fontWeight: 500,
        lineHeight: 1.57,
    },
    body1: {
        fontSize: "1.0rem",
        fontWeight: 400,
        lineHeight: 1.5,
    },
    body2: {
        fontSize: "0.875rem",
        fontWeight: 400,
        lineHeight: 1.43,
    },
    button: {
        fontSize: "0.875rem",
        fontWeight: 500,
        lineHeight: 1.75,
        textTransform: "uppercase",
    },
    caption: {
        fontSize: "0.75rem",
        fontWeight: 400,
        lineHeight: 1.66,
    },
    overline: {
        fontSize: "0.75rem",
        fontWeight: 400,
        lineHeight: 2.66,
        textTransform: "uppercase",
    },
};

const ColorScheme: { [key: string]: any } = {
    // 'dark' here means a darker variant of the primary color, not related to dark mode theme.
    primary: {
        main: '#3676f4',
        light: '#a5c4ff',
        dark: '#0046a3',
        contrastText: '#0e2a71',
    },
    secondary: {
        main: '#e7364a',
        light: '#ff9aa6',
        dark: '#a8001f',
        contrastText: '#5c0010',
    },
    neutral: {
        main: '#f5f5f7',
        light: '#ffffff',
        dark: '#c1c3cc',
        contrastText: '#3a3a3a',
    },
    accent: {
        main: '#977bff',
        light: '#c6adff',
        dark: '#5e2efb',
        contrastText: '#2e1b57',
    },
    background: {
        default: "#fefefc"
    },
    state: {
        success: {
            main: '#2ecc71',
            light: '#b9f6c9',
            dark: '#1e7f4e',
            contrastText: '#145f3e',
        },
        warning: {
            main: '#f5b700',
            light: '#fff2a6',
            dark: '#aa8700',
            contrastText: '#5e4500',
        },
        error: {
            main: '#e7364a',
            light: '#ff9aa6',
            dark: '#a8001f',
            contrastText: '#5c0010',
        },
        info: {
            main: '#3676f4',
            light: '#a5c4ff',
            dark: '#0046a3',
            contrastText: '#0e2a71',
        }
    }
};

export {
    FontFamilyScheme,
    FontSizeScheme,
    ColorScheme,
    BreakPointsSchem
}