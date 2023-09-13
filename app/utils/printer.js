import { BluetoothManager, BluetoothEscposPrinter } from '@pipechela/react-native-bluetooth-escpos-printer'
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from 'react-native';

// function reemplazarCaracteresEspeciales(texto) {
//     return texto
//         .normalize("NFD") // Descomponer caracteres acentuados
//         .replace(/[\u0300-\u036f]/g, "") // Eliminar caracteres diacríticos
//         .replace(/[ñÑ]/g, "n"); // Reemplazar "ñ" y "Ñ" por "n"
// }

function reemplazarCaracteresEspeciales(texto) {
    const reemplazos = {
        "ñ": "n",
        "Ñ": "N"
    };

    const textoSinAcentos = texto
        .normalize("NFD") // Descomponer caracteres acentuados
        .replace(/[\u0300-\u036f]/g, ""); // Eliminar caracteres diacríticos

    return textoSinAcentos.replace(/[ñÑ]/g, match => reemplazos[match]);
}

// const impresora = await AsyncStorage.getItem('connected_printer')

export const imprimirPedidos = async comanda => {
    const columnasCobros = [2, 7, 32 - (2 + 7 + 9), 9]

    const promesas = comanda.pedidos.map(async pedido => {
        await BluetoothEscposPrinter.printText(reemplazarCaracteresEspeciales(pedido.nombre) + '\r\n', {
            // encoding:'win_1252',
            // codepage:14
        });

        await BluetoothEscposPrinter.printColumn(
            columnasCobros,
            [
                BluetoothEscposPrinter.ALIGN.RIGHT,
                BluetoothEscposPrinter.ALIGN.LEFT,
                BluetoothEscposPrinter.ALIGN.LEFT,
                BluetoothEscposPrinter.ALIGN.RIGHT
            ],
            [
                pedido.cantidad.toLocaleString('es-CL'),
                'x',
                '$ ' + pedido.precioUnitario.toLocaleString('es-CL'),
                '$ ' + (pedido.cantidad * pedido.precioUnitario).toLocaleString('es-CL')
            ],
            {}
        );

        if (pedido.extras.length > 0) {
            for (let extra of pedido.extras) {
                await BluetoothEscposPrinter.printText('(+) ' + reemplazarCaracteresEspeciales(extra.nombre) + '\r\n', {});

                await BluetoothEscposPrinter.printColumn(
                    columnasCobros,
                    [
                        BluetoothEscposPrinter.ALIGN.RIGHT,
                        BluetoothEscposPrinter.ALIGN.LEFT,
                        BluetoothEscposPrinter.ALIGN.LEFT,
                        BluetoothEscposPrinter.ALIGN.RIGHT
                    ],
                    [
                        extra.cantidad.toLocaleString('es-CL'),
                        'x',
                        '$ ' + extra.precioUnitario.toLocaleString('es-CL'),
                        '$ ' + (extra.cantidad * extra.precioUnitario).toLocaleString('es-CL')
                    ],
                    {}
                );
            }
        }
    });

    await Promise.all(promesas);
};

export const printComanda = async (comanda) => {
    const impresora = await AsyncStorage.getItem('connected_printer')

    try {
        // const impresora = await AsyncStorage.getItem('connected_printer')

        // console.log(comanda)
        // const connected = await BluetoothManager.getConnectedDeviceAddress()
        // const equipos = await BluetoothManager.enableBluetooth()

        console.log({ impresora })
        impresora && await BluetoothManager.connect(impresora)
        await BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.CENTER)
        await BluetoothEscposPrinter.printText(`Cafe Con Leche\r\n`, { heigthtimes: 1, widthtimes: 1 })
        await BluetoothEscposPrinter.printText(`Pudeto #375 - Quillota\r\n`, {})
        await BluetoothEscposPrinter.printText(`${new Date().toLocaleString('es-CL')}\r\n`, {})
        await BluetoothEscposPrinter.printText(`MESA: ${comanda.mesaName}\r\n`, {})
        await BluetoothEscposPrinter.printText(`${comanda._id}\r\n`, {})
        await BluetoothEscposPrinter.printText(`\r\n`, {})

        await BluetoothEscposPrinter.printColumn(
            [9, 32 - (9 + 9), 9],
            [
                BluetoothEscposPrinter.ALIGN.LEFT,
                BluetoothEscposPrinter.ALIGN.LEFT,
                BluetoothEscposPrinter.ALIGN.RIGHT
            ],
            [
                'PRODUCTO',
                '$ UNIT',
                '$ TOTAL'
            ],
            {}

        )
        await BluetoothEscposPrinter.printText("--------------------------------\r\n", {});

        await BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.LEFT)

        for (let i = 0; i < comanda.pedidos.length; i++) {
            // console.log(comanda.pedidos[i])
            await BluetoothEscposPrinter.printText(reemplazarCaracteresEspeciales(comanda.pedidos[i].nombre) + '\r\n', {})
            await BluetoothEscposPrinter.printColumn(
                [2, 7, 32 - (2 + 7 + 9), 9],

                [
                    BluetoothEscposPrinter.ALIGN.RIGHT,
                    BluetoothEscposPrinter.ALIGN.LEFT,
                    BluetoothEscposPrinter.ALIGN.LEFT,
                    BluetoothEscposPrinter.ALIGN.RIGHT
                ],
                [
                    comanda.pedidos[i].cantidad.toLocaleString('es-CL'),
                    'x',
                    '$ ' + comanda.pedidos[i].precioUnitario.toLocaleString('es-CL'),
                    '$ ' + (comanda.pedidos[i].cantidad * comanda.pedidos[i].precioUnitario).toLocaleString('es-CL')
                ],
                {}
            )
            if (comanda.pedidos[i].extras.length > 0) {
                for (let k = 0; k < comanda.pedidos[i].extras.length; k++) {
                    await BluetoothEscposPrinter.printText('(+) ' + reemplazarCaracteresEspeciales(comanda.pedidos[i].extras[k].nombre) + '\r\n', {})
                    await BluetoothEscposPrinter.printColumn(
                        [2, 7, 32 - (2 + 7 + 9), 9],
                        [
                            BluetoothEscposPrinter.ALIGN.RIGHT,
                            BluetoothEscposPrinter.ALIGN.LEFT,
                            BluetoothEscposPrinter.ALIGN.LEFT,
                            BluetoothEscposPrinter.ALIGN.RIGHT
                        ],
                        [
                            comanda.pedidos[i].extras[k].cantidad.toLocaleString('es-CL'),
                            'x',
                            '$ ' + comanda.pedidos[i].extras[k].precioUnitario.toLocaleString('es-CL'),
                            '$ ' + (comanda.pedidos[i].extras[k].precioUnitario * comanda.pedidos[i].extras[k].cantidad).toLocaleString('es-CL')
                        ],
                        {}
                    )
                }

            }
        }

        // await imprimirPedidos(comanda)
        await BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.CENTER)
        await BluetoothEscposPrinter.printText("--------------------------------\r\n", {});
        await BluetoothEscposPrinter.printText(`Total $${comanda.total.toLocaleString('es-CL')}\r\n`, { heigthtimes: 1, widthtimes: 1 })
        await BluetoothEscposPrinter.printQRCode(`https://www.instagram.com/cafe.con.leche_q`, 150, BluetoothEscposPrinter.ERROR_CORRECTION.H)
        await BluetoothEscposPrinter.printText(`\r\n`, {})
        await BluetoothEscposPrinter.printText(`Facebook: /CafeConLecheQuillota\r\n`, {})
        await BluetoothEscposPrinter.printText(`Instagram: @cafe.con.leche_q\r\n`, {})
        await BluetoothEscposPrinter.printText(`No valido como boleta\r\n`, {})
        await BluetoothEscposPrinter.printText("--------------------------------\r\n", {});
        await BluetoothEscposPrinter.printText(`\r\n`, {})
        // await BluetoothManager.disconnect(impresora)
    } catch (error) {
        console.error(error)
        console.log(impresora)
        Alert.alert(
            'Error',
            `${error}`,
            [{
                text: 'Enviar informe',
                onPress: () => { console.log(error) }
            }]
        )
    } finally {
        const connectedDevice = await BluetoothManager.getConnectedDeviceAddress()
        if (connectedDevice) {
            Alert.alert(
                'Imprimiendo comanda',
                'Pulse aceptar cuando se haya terminado de imprimir la comanda para desconectar la impresora',
                [{
                    text: 'Aceptar',
                    onPress: async () => await BluetoothManager.disconnect(impresora)
                }])
        }
    }
}