import React, { useState, useEffect } from "react";
import { FlatList, PermissionsAndroid, View, Pressable, Alert } from "react-native";
import { BluetoothManager, BluetoothEscposPrinter } from '@pipechela/react-native-bluetooth-escpos-printer';
import { Input, Icon, Button, Text } from "@rneui/themed";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const PrinterScreen = () => {

    console.log('iniciando printer screen')

    const [equipos, setEquipos] = useState([])
    const [equipoConectado, setEquipoConectado] = useState('')
    const [conectado, setConectado] = useState(false)
    const [loading, setLoading] = useState(false)
    const [encoding, setEncoding] = useState('cp850')
    const [codepage, setCodepage] = useState(2)
    const [textToPrint, setTextToPrint] = useState('')

    useEffect(() => {
        getPermissions()
    }, [])

    const getPermissions = async () => {
        try {
            await PermissionsAndroid.request('android.permission.BLUETOOTH_CONNECT')
            await PermissionsAndroid.request('android.permission.BLUETOOTH_SCAN')
            await PermissionsAndroid.request('android.permission.ACCESS_FINE_LOCATION')

        } catch (error) {
            console.error(error)
        }
    }


    const escanea = async () => {
        try {
            setLoading(true)
            setEquipos([])
            console.log('escaneando...')
            console.log(new Date())
            const btDevices = await BluetoothManager.scanDevices()
            console.log(new Date())
            const equiposBT = JSON.parse(btDevices)
            console.log(btDevices)
            setLoading(false)
            // if()
            setEquipos(equiposBT.paired)
            // console.log(equipos)
        } catch (error) {
            console.error(error)
            Alert.alert(JSON.stringify(error))
        }
    }

    const conectar = async (equipo) => {
        try {
            console.log(`conectando a ${equipo} ...`)
            await BluetoothManager.connect(equipo)
            await AsyncStorage.setItem('connected_printer', equipo)
            setEquipoConectado(equipo)
            setConectado(true)
            console.log(`conectado :)`)
            Alert.alert(`conectado a ${equipo}`)
        } catch (error) {
            console.error(error)
            Alert.alert(JSON.stringify(error))
            Alert.alert('Error', error.message)
        }
    }

    const habilitaBluetooth = async () => {
        try {
            const emparejados = []
            const datos = await BluetoothManager.enableBluetooth()
            datos.forEach(item => emparejados.push(JSON.parse(item)))
            setEquipos(emparejados)
        } catch (error) {
            console.error(error)
            Alert.alert(JSON.stringify(error))
        }
    }

    const deshabilitaBluetooth = async () => {
        try {
            const datos = await BluetoothManager.disableBluetooth()
            Alert.alert(`${datos}`)
            console.log(datos)
        } catch (error) {
            console.error(error)
            Alert.alert(JSON.stringify(error))
        }
    }

    const desconectarImpresora = async () => {
        try {
            const equipo = await BluetoothManager.getConnectedDeviceAddress()
            const equipoConectado = equipo
            console.log(equipoConectado)
            Alert.alert(`${equipoConectado}`)
            setConectado(false)
            console.log(`desconectando de ${equipoConectado || 'SIN NOMBRE'} ...`)
            // await BluetoothManager.unpaire(equipoConectado)
            await BluetoothManager.disconnect(equipoConectado)
            console.log(`desconectado :/`)
        } catch (error) {
            console.error(error)
            Alert.alert(JSON.stringify(error))
        }
    }

    const estaHabilitado = async () => {
        try {
            const enabled = await BluetoothManager.isBluetoothEnabled()
            // Alert.alert(enabled)
            console.log(enabled)
        } catch (error) {
            console.error(error)
            Alert.alert(JSON.stringify(error))
        }
    }

    const autoTest = async () => {
        try {
            await BluetoothEscposPrinter.selfTest()
        } catch (error) {
            console.error(error)
            Alert.alert(JSON.stringify(error))
        }
    }

    const estaConectado = async () => {
        try {
            const esta = await BluetoothManager.isDeviceConnected()
            console.warn(esta)

        } catch (error) {
            console.error(error)
        }
    }

    const getConnectedDevice = async () => {
        try {
            const equipo = await BluetoothManager.getConnectedDeviceAddress()
            console.log(equipo)
            Alert.alert(equipo)
        } catch (error) {
            console.error(error)
            Alert.alert(JSON.stringify(error))
        }
    }

    const printReceta = async () => {
        await BluetoothEscposPrinter.printerInit()

        let columnWidths = [8, 20, 20];
        try {
            await BluetoothEscposPrinter.printText('\r\n\r\n\r\n', {});
            await BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.CENTER);
            await BluetoothEscposPrinter.printColumn(
                [48],
                [BluetoothEscposPrinter.ALIGN.CENTER],
                ['Jl. Brigjen Saptadji Hadiprawira No.93'],
                {},
            );
            await BluetoothEscposPrinter.printColumn(
                [32],
                [BluetoothEscposPrinter.ALIGN.CENTER],
                ['https://xfood.id'],
                {},
            );
            await BluetoothEscposPrinter.printText(
                '================================================',
                {},
            );
            await BluetoothEscposPrinter.printColumn(
                [24, 24],
                [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT],
                ['Customer', 'Prawito Hudoro'],
                {},
            );
            await BluetoothEscposPrinter.printColumn(
                [24, 24],
                [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT],
                ['Packaging', 'Iya'],
                {},
            );
            await BluetoothEscposPrinter.printColumn(
                [24, 24],
                [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT],
                ['Delivery', 'Ambil Sendiri'],
                {},
            );
            await BluetoothEscposPrinter.printText(
                '================================================',
                {},
            );
            await BluetoothEscposPrinter.printText('Products\r\n', { widthtimes: 1 });
            await BluetoothEscposPrinter.printText(
                '================================================',
                {},
            );
            await BluetoothEscposPrinter.printColumn(
                columnWidths,
                [
                    BluetoothEscposPrinter.ALIGN.LEFT,
                    BluetoothEscposPrinter.ALIGN.LEFT,
                    BluetoothEscposPrinter.ALIGN.RIGHT,
                ],
                ['1x', 'Cumi-Cumi', 'Rp.200.000'],
                {},
            );
            await BluetoothEscposPrinter.printColumn(
                columnWidths,
                [
                    BluetoothEscposPrinter.ALIGN.LEFT,
                    BluetoothEscposPrinter.ALIGN.LEFT,
                    BluetoothEscposPrinter.ALIGN.RIGHT,
                ],
                ['1x', 'Tongkol Kering', 'Rp.300.000'],
                {},
            );
            await BluetoothEscposPrinter.printColumn(
                columnWidths,
                [
                    BluetoothEscposPrinter.ALIGN.LEFT,
                    BluetoothEscposPrinter.ALIGN.LEFT,
                    BluetoothEscposPrinter.ALIGN.RIGHT,
                ],
                ['1x', 'Ikan Tuna', 'Rp.400.000'],
                {},
            );
            await BluetoothEscposPrinter.printText(
                '================================================',
                {},
            );
            await BluetoothEscposPrinter.printColumn(
                [24, 24],
                [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT],
                ['Subtotal', 'Rp.900.000'],
                {},
            );
            await BluetoothEscposPrinter.printColumn(
                [24, 24],
                [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT],
                ['Packaging', 'Rp.6.000'],
                {},
            );
            await BluetoothEscposPrinter.printColumn(
                [24, 24],
                [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT],
                ['Delivery', 'Rp.0'],
                {},
            );
            await BluetoothEscposPrinter.printText(
                '================================================',
                {},
            );
            await BluetoothEscposPrinter.printColumn(
                [24, 24],
                [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT],
                ['Total', 'Rp.906.000'],
                {},
            );
            await BluetoothEscposPrinter.printText('\r\n\r\n', {});
            await BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.CENTER);
            await BluetoothEscposPrinter.printQRCode(
                'DP0837849839',
                280,
                BluetoothEscposPrinter.ERROR_CORRECTION.L,
            );
            await BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.CENTER);
            await BluetoothEscposPrinter.printColumn(
                [48],
                [BluetoothEscposPrinter.ALIGN.CENTER],
                ['DP0837849839'],
                { widthtimes: 2 },
            );
            await BluetoothEscposPrinter.printText(
                '================================================',
                {},
            );
            await BluetoothEscposPrinter.printColumn(
                [48],
                [BluetoothEscposPrinter.ALIGN.CENTER],
                ['Sabtu, 18 Juni 2022 - 06:00 WIB'],
                {},
            );
            await BluetoothEscposPrinter.printText(
                '================================================',
                {},
            );
            await BluetoothEscposPrinter.printText('\r\n\r\n\r\n', {});
            await BluetoothEscposPrinter.printText('\r\n\r\n\r\n', {});
        } catch (e) {
            console.error(e)
        }
    }

    const printMuchasLineas = async (texto, k) => {
        for (let i = 0; i++; i <= k) {
            await BluetoothEscposPrinter.printerInit()

            await BluetoothEscposPrinter.printText(`${texto}\n\r`, {
                encoding: "CP850",
                codepage: 2,
                widthtimes: 0,
                heigthtimes: 0,
                fonttype: 1,
            })
        }
    }


    const printAlgunaWea = async () => {
        try {
            await BluetoothEscposPrinter.printerInit()
            await BluetoothEscposPrinter.printText(`jugo de piña $1.500:${codepage} ENC:${encoding}\n\r`, {
                encoding: `${encoding.toLowerCase()}`,
                codepage: parseInt(codepage),
            })


            // for (let k = 0; k++; k < 3) {
            //   console.log('imprimiendo linea ', k + 1)
            //   await BluetoothEscposPrinter.printText("gudbaiÑá!\n\r", {
            //     encoding: "cp850",
            //     codepage: 2,
            //     widthtimes: k,
            //     heigthtimes: k,
            //     fonttype: 1,
            //   })
            // }

            // console.log('.... despues del for!!!')

            // await printUnaLinea('soy una lineaMMM')
            // await printMuchasLineas('soy muchas lineas', 3)
            // await BluetoothEscposPrinter.printQRCode(
            //   'kirita',
            //   200,
            //   BluetoothEscposPrinter.ERROR_CORRECTION.L
            // )
            // await BluetoothEscposPrinter.printQRCode(
            //     'kirita',
            //     200,
            //     BluetoothEscposPrinter.ERROR_CORRECTION.M,
            //     90
            // )
            // await BluetoothEscposPrinter.printQRCode(
            //     'kirita',
            //     200,
            //     BluetoothEscposPrinter.ERROR_CORRECTION.Q,
            //     90
            // )
            // await BluetoothEscposPrinter.printQRCode(
            //   'kirita',
            //   200,
            //   BluetoothEscposPrinter.ERROR_CORRECTION.H,
            //   90
            // )
            // await BluetoothEscposPrinter.printText("\n\r\n\r\n\r", {
            //     encoding: "GBK",
            //     codepage: 0,
            //     widthtimes: 3,
            //     heigthtimes: 3,
            //     fonttype: 1,
            // })

            // await BluetoothEscposPrinter.printerLineSpace(5)
            // await BluetoothEscposPrinter.printAndFeed(5)

        } catch (error) {
            console.error(error)
            Alert.alert(JSON.stringify(error))
        }


    }

    const pruebas = async () => {
        try {
            await BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.CENTER);
            await BluetoothEscposPrinter.printText('\r\n\r\n\r\n', {});
            await BluetoothEscposPrinter.printText('1234567890', {});
            await BluetoothEscposPrinter.printText('1234567890', {});
            await BluetoothEscposPrinter.printText('1234567890', {});
            await BluetoothEscposPrinter.printText('1234567890', {});
            await BluetoothEscposPrinter.printText('\r\n\r\n\r\n', {});
            await BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.RIGHT);
            await BluetoothEscposPrinter.printText('29\r\n\r\n', {});
            await BluetoothEscposPrinter.printColumn(
                [29],
                [BluetoothEscposPrinter.ALIGN.CENTER],
                ['algo que puede que no quepa en una linea'],
                {},
            );
            await BluetoothEscposPrinter.printText('30\r\n\r\n', {});
            await BluetoothEscposPrinter.printColumn(
                [30],
                [BluetoothEscposPrinter.ALIGN.CENTER],
                ['1234567890123456789012345678901234567890'],
                {},
            );
            await BluetoothEscposPrinter.printText('31\r\n\r\n', {});

            await BluetoothEscposPrinter.printColumn(
                [31],
                [BluetoothEscposPrinter.ALIGN.CENTER],
                ['1234567890123456789012345678901234567890'],
                {},
            );
            await BluetoothEscposPrinter.printText('32\r\n\r\n', {});
            await BluetoothEscposPrinter.printColumn(
                [32],
                [BluetoothEscposPrinter.ALIGN.CENTER],
                ['1234567890123456789012345678901234567890'],
                {},
            );
            await BluetoothEscposPrinter.printText('33\r\n\r\n', {});
            await BluetoothEscposPrinter.printColumn(
                [33],
                [BluetoothEscposPrinter.ALIGN.CENTER],
                ['1234567890123456789012345678901234567890'],
                {},
            );
            await BluetoothEscposPrinter.printText('34\r\n\r\n', {});
            await BluetoothEscposPrinter.printColumn(
                [34],
                [BluetoothEscposPrinter.ALIGN.CENTER],
                ['1234567890123456789012345678901234567890'],
                {},
            );
            await BluetoothEscposPrinter.printColumn(
                [3, 10, 20],
                [
                    BluetoothEscposPrinter.ALIGN.LEFT,
                    BluetoothEscposPrinter.ALIGN.LEFT,
                    BluetoothEscposPrinter.ALIGN.RIGHT,
                ],
                ['2x', '$1.950', '$3.900'],
                {},
            );
        } catch (error) {
            console.error(error)
        }
    }


    const otrasweas = async () => {
        try {
            await BluetoothEscposPrinter.printerInit();
            await BluetoothEscposPrinter.printerLeftSpace(0);

            await BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.CENTER);
            await BluetoothEscposPrinter.setBlob(0);
            await BluetoothEscposPrinter.printText("广州俊烨\r\n", {
                encoding: 'GBK',
                codepage: 0,
                widthtimes: 3,
                heigthtimes: 3,
                fonttype: 1
            });
            await BluetoothEscposPrinter.setBlob(0);
            await BluetoothEscposPrinter.printText("销售单\r\n", {
                encoding: 'GBK',
                codepage: 0,
                widthtimes: 0,
                heigthtimes: 0,
                fonttype: 1
            });
            await BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.LEFT);
            await BluetoothEscposPrinter.printText("客户：零售客户\r\n", {});
            await BluetoothEscposPrinter.printText("单号：xsd201909210000001\r\n", {});
            // await BluetoothEscposPrinter.printText("日期：" + new Date(), + "\r\n", {});
            await BluetoothEscposPrinter.printText("销售员：18664896621\r\n", {});
            await BluetoothEscposPrinter.printText("--------------------------------\r\n", {});
            let columnWidths = [12, 6, 6, 8];
            await BluetoothEscposPrinter.printColumn(columnWidths,
                [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.CENTER, BluetoothEscposPrinter.ALIGN.CENTER, BluetoothEscposPrinter.ALIGN.RIGHT],
                ["商品", '数量', '单价', '金额'], {});
            await BluetoothEscposPrinter.printColumn(columnWidths,
                [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.CENTER, BluetoothEscposPrinter.ALIGN.RIGHT],
                ["React-Native定制开发我是比较长的位置你稍微看看是不是这样?", '1', '32000', '32000'], {});
            await BluetoothEscposPrinter.printText("\r\n", {});
            await BluetoothEscposPrinter.printColumn(columnWidths,
                [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.CENTER, BluetoothEscposPrinter.ALIGN.RIGHT],
                ["React-Native定制开发我是比较长的位置你稍微看看是不是这样?", '1', '32000', '32000'], {});
            await BluetoothEscposPrinter.printText("\r\n", {});
            await BluetoothEscposPrinter.printText("--------------------------------\r\n", {});
            await BluetoothEscposPrinter.printColumn([12, 8, 12],
                [BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.LEFT, BluetoothEscposPrinter.ALIGN.RIGHT],
                ["合计", '2', '64000'], {});
            await BluetoothEscposPrinter.printText("\r\n", {});
            await BluetoothEscposPrinter.printText("折扣率：100%\r\n", {});
            await BluetoothEscposPrinter.printText("折扣后应收：64000.00\r\n", {});
            await BluetoothEscposPrinter.printText("会员卡支付：0.00\r\n", {});
            await BluetoothEscposPrinter.printText("积分抵扣：0.00\r\n", {});
            await BluetoothEscposPrinter.printText("支付金额：64000.00\r\n", {});
            await BluetoothEscposPrinter.printText("结算账户：现金账户\r\n", {});
            await BluetoothEscposPrinter.printText("备注：无\r\n", {});
            await BluetoothEscposPrinter.printText("快递单号：无\r\n", {});
            // await BluetoothEscposPrinter.printText("打印时间：" + new Date() + "\r\n", {});
            await BluetoothEscposPrinter.printText("--------------------------------\r\n", {});
            await BluetoothEscposPrinter.printText("电话：\r\n", {});
            await BluetoothEscposPrinter.printText("地址:\r\n\r\n", {});
            await BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.CENTER);
            await BluetoothEscposPrinter.printText("欢迎下次光临\r\n\r\n\r\n", {});
            await BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.LEFT);
            await BluetoothEscposPrinter.printText("\r\n\r\n\r\n", {});
        } catch (e) {
            Alert.alert(e.message || "ERROR");
        }

    }

    const printCuadroDeTexto = async () => {
        try {
            await BluetoothEscposPrinter.printerInit()
            console.log(`Imprimiendo ${textToPrint.length} caracteres`)
            await BluetoothEscposPrinter.printText(textToPrint, {})
            await BluetoothEscposPrinter.printText("\r\n\r\n\r\n", {});
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <View>
            <Input
                onChangeText={setTextToPrint}
                value={textToPrint}
                placeholder="INGRESE TEXTO PARA IMPRIMIR"
                leftIcon={{ name: "print" }}
            />
            {/* <Button
                title="esta habilitado"
                onPress={estaHabilitado}
            /> */}
            <Button
                title="ver dispositivo"
                color={conectado ? "#00ff00" : "#ff0000"}
                onPress={getConnectedDevice}
            />
            {/* <Button
                title="esta conectado?"
                onPress={estaConectado}
            /> */}
            <Button
                title="escanea"
                onPress={escanea}
            />
            <Button
                title="desconecta"
                onPress={desconectarImpresora}
            />
            <Button
                title="habilita BT / ver dispositivos"
                onPress={habilitaBluetooth}
            />
            <Button
                title="deshabilita BT"
                onPress={deshabilitaBluetooth}
            />
            <Icon
                name="print"
            />
            <Button
                title="IMPRIME"
                onPress={printCuadroDeTexto}
            />
            {loading
                ? <Text>CARGANDO ...</Text>
                : <FlatList
                    data={equipos}
                    ListEmptyComponent={<Text>no hay impresoras</Text>}
                    keyExtractor={(_, index) => index}
                    renderItem={({ item }) => <View style={{ padding: 20 }}><Pressable onPress={() => conectar(item.address)}><Text>NOMBRE: {item.name} - MAC: {item.address}</Text></Pressable></View>}
                />}
        </View>
    )

}

// export default App