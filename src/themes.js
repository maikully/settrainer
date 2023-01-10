import { createTheme } from "@material-ui/core/styles";
import { red } from "@material-ui/core/colors";

export const lightTheme = createTheme({
    palette: {
        type: "dark",
        primary: {
          light: "#c5cae9",
          main: "#8c9eff",
          dark: "#536dfe",
        },
        secondary: {
          light: "#ff80ac",
          main: "#ff4284",
          dark: "#c51162",
        },
    
        action: {
          hover: "#363636",
        },
        success: {
          light: "#81c784",
          main: "#a5d6a7",
          dark: "#82c483",
        },
        background: {
          panel: "#303030",
          paper: "#262626",
          default: "#161616",
        },
      },
      input: {
        textColor: "#fff",
        caretColor: "#fff",
        background: "#262626",
      },
    pie: {
      noGames: "rgba(0, 0, 0, 0.12)",
    },
    setCard: {
      purple: "#800080",
      green: "#008002",
      red: "#ff0101",
      background: "#fff",
    },
    alarm: red[700],
    profileTable: {
      row: "#fff",
    },
    setFoundEntry: "rgba(130, 170, 100, 0.15)",
  });