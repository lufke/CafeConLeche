import { createTheme } from "@rneui/themed";

export const theme = createTheme({
    components: {
        SpeedDial: {
            color: 'saddlebrown'
        },
        SpeedDialAction: {
            color: 'saddlebrown'
        },
        FAB: {
            color: 'saddlebrown',
            size: 50,
            placement: 'left'
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
    background: {
        color: 'red'
    },
    // mode: 'dark',
});