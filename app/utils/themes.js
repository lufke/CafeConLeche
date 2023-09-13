import { createTheme } from "@rneui/themed";

export const theme = createTheme({
    mode: 'ligth',
    components: {
        SpeedDial: {
            color: 'saddlebrown'
        },
        SpeedDialAction: {
            color: 'saddlebrown'
        },
        FAB: {
            color: 'saddlebrown',
            size: 'large',
            placement: 'right'
        },
        DialogTitle: {
            title: 'red'
        },
        Text: {
            color: 'green'
        }
    },
    lightColors: {
        primary: 'saddlebrown',

    },
    darkColors: {
        primary: 'blue',
    },

    // mode: 'dark',
});