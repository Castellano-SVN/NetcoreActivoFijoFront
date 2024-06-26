import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
    page: {
        fontFamily: 'Helvetica',
        fontSize: 12,
        padding: 20
    },
    section: {
        margin: 10,
        padding: 10
    },
    header: {
        fontSize: 14,
        marginBottom: 10,
        textAlign: 'center',
        textTransform: 'uppercase',
        fontWeight: 'bold'
    },
    table: {
        width: 'auto',
        borderStyle: 'solid',
        borderWidth: 1,
        borderRightWidth: 0,
        borderBottomWidth: 0
    },
    tableRow: {
        flexDirection: 'row'
    },
    tableCol: {
        width: '20%',
        borderStyle: 'solid',
        borderWidth: 1,
        borderLeftWidth: 0,
        borderTopWidth: 0
    },
    tableCell: {
        margin: 5,
        fontSize: 10
    }
});

export default function PDFGuiaDespacho() {

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <Text style={styles.header}>Guia de despacho</Text>

                <View style={styles.section}>
                    <Text>BODEGA ORIGEN: BODEGA CENTRAL</Text>
                    <Text>BODEGA DESTINO:BODEGA CESFAM DR. SOTERO DEL RIO</Text>
                    <Text>DIRECCIÓN ORIGEN: AV.CARRASCAL 4747</Text>
                    <Text>DIRECCIÓN DESTINO: CALLE SARGENTO URRUTIA N*125</Text>
                </View>

                <View style={styles.table}>
                    <View style={styles.tableRow}>
                        <View style={styles.tableCol}>
                            <Text style={styles.tableCell}>Correlativo</Text>
                        </View>
                        <View style={styles.tableCol}>
                            <Text style={styles.tableCell}>Código articulo</Text>
                        </View>
                        <View style={styles.tableCol}>
                            <Text style={styles.tableCell}>Código familia</Text>
                        </View>
                        <View style={styles.tableCol}>
                            <Text style={styles.tableCell}>Familia</Text>
                        </View>
                        <View style={styles.tableCol}>
                            <Text style={styles.tableCell}>Código sub-familia</Text>
                        </View>
                        <View style={styles.tableCol}>
                            <Text style={styles.tableCell}>Sub-familia</Text>
                        </View>
                        <View style={styles.tableCol}>
                            <Text style={styles.tableCell}>Descripción articulo</Text>
                        </View>
                        <View style={styles.tableCol}>
                            <Text style={styles.tableCell}>Cantidad</Text>
                        </View>
                    </View>
                    <View style={styles.tableRow}>
                        <View style={styles.tableCol}>
                            <Text style={styles.tableCell}>1</Text>
                        </View>
                        <View style={styles.tableCol}>
                            <Text style={styles.tableCell}>20001001</Text>
                        </View>
                        <View style={styles.tableCol}>
                            <Text style={styles.tableCell}>200</Text>
                        </View>
                        <View style={styles.tableCol}>
                            <Text style={styles.tableCell}>200 CURACIONES Y EXAMENES</Text>
                        </View>
                        <View style={styles.tableCol}>
                            <Text style={styles.tableCell}>200001</Text>
                        </View>
                        <View style={styles.tableCol}>
                            <Text style={styles.tableCell}>INSUMOS MEDICOS</Text>
                        </View>
                        <View style={styles.tableCol}>
                            <Text style={styles.tableCell}>APOSITO COLAGENO 10X11</Text>
                        </View>
                        <View style={styles.tableCol}>
                            <Text style={styles.tableCell}>20</Text>
                        </View>
                    </View>
                    <View style={styles.tableRow}>
                        <View style={styles.tableCol}>
                            <Text style={styles.tableCell}>2</Text>
                        </View>
                        <View style={styles.tableCol}>
                            <Text style={styles.tableCell}>20001002</Text>
                        </View>
                        <View style={styles.tableCol}>
                            <Text style={styles.tableCell}>200</Text>
                        </View>
                        <View style={styles.tableCol}>
                            <Text style={styles.tableCell}>200 CURACIONES Y EXAMENES</Text>
                        </View>
                        <View style={styles.tableCol}>
                            <Text style={styles.tableCell}>200001</Text>
                        </View>
                        <View style={styles.tableCol}>
                            <Text style={styles.tableCell}>INSUMOS MEDICOS</Text>
                        </View>
                        <View style={styles.tableCol}>
                            <Text style={styles.tableCell}>CREMA HUMECTANTE UREA</Text>
                        </View>
                        <View style={styles.tableCol}>
                            <Text style={styles.tableCell}>40</Text>
                        </View>
                    </View>
                </View>

            </Page>
        </Document>
    );
}