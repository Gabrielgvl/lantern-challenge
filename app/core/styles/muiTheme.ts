import { createTheme } from "@material-ui/core";
const colors = require("tailwindcss/colors");

const muiTheme = createTheme({
  palette: {
    primary: colors.indigo,
    mode: "dark",
  },
});

export default muiTheme;
