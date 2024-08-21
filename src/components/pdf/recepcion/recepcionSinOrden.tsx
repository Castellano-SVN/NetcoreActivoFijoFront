import React from "react";
import {
  Document,
  Text,
  Page,
  StyleSheet,
  Image,
  View,
} from "@react-pdf/renderer";
import { recepcionSOC } from "@/interfaces/recepcion.interface";

interface props {
  data: recepcionSOC;
  location: { centrocosto?: string; bodega?: string; almacen?: string };
}
const LogoNetCoreBase64 =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAAAtCAYAAAAUVlZkAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAABfaVRYdFNuaXBNZXRhZGF0YQAAAAAAeyJjbGlwUG9pbnRzIjpbeyJ4IjowLCJ5IjowfSx7IngiOjMwMCwieSI6MH0seyJ4IjozMDAsInkiOjQ1fSx7IngiOjAsInkiOjQ1fV19GE0eIwAAEfFJREFUeF7tnQ9wFNd9x38CzNkGjO24ByaxAM/gdBJd68RizBRRgWHSqYU9xkrSQUkNKHaQas8g3GkKZMaSaGPhNkZigpHtpBKeBpEJkXAwSlIijBREDdU5ppwyTWAmEjLgcqYG4RgjgbT9fXff0719uj97pxPSOe+Df963+97+9r09ft/7vbcrlGUxZDAYDBnABLE1GAyGcY8RLIPBkDEYwTIYDBmDESyDZ8795hoF93ws9gyGG49ZdM9QftfaR2+9doV++6s+eu/9Abp2axbdt8RHf/k3t9JDj90iWqUXCFZFTphetT4tjhgMNxYjWBnIi0su2II1MJlsoXJMlFmrHlpxK3199RSaOWOiOCM9GMEyjDVmSphhfHfJ+7ZYXbuZqG9qFhu2ik0heuPwx/RM5UV678KAOMtg+GRgBCuDeKPyQzrZ2k/9LFT90zTjY9emZNF13l7nbc8Vi56q7qVzHxjRMnxySFqwjrYGaeWSb9LcrC/SornL6R/WVIiaCGiDetkG+yNlW+Urti9c+yc794mjf1y8/s+X6eptIpOaJozL/ZxV9bNI2cbTQmwxRey5Mkirvt9LZy8NCg8GQ2aTtGBtq3x1SIDOdJ+zxQNCooLjEpQbX9sv9lLnJzvfsH3h2hBJ9Rp/DFw4PaBlVRPs7bWpExyDSMGQabFoXb/FsdNXLVq5+zKduWxEy5D5pGVKKIUkFonEJdH50fAqWGiXjP9U+gLkdRKRqv/3z1wX61Ri3QpZFbIpzqRss7Msste2pPXfbPHWou6rA/Tl13vp3Q+NaBkym7StYUWbGsYDgYtz5LRRnWZi+pcIZHo4HxZtiggf0p/0j220fqbaF/08mCyrjHSsYHBiJLtysiqRTQnDupWdVSG7EjbA+wM3s/myqLvPoscOXKaej4xoGTKXtAlWMpkD2iFYowkN/NRUvBJVWFTgA+fDIF4qEAT40IFvp32kzktfUK+PDe3jnSfbp2Os4PMLJtMd902KZFL2awxKmTOq6yKzsrc+3sImO9sBtq7+QVreyqJ1xYiWITNJm2ABL4GHIIWgqHxmzixasDhX7DkgwKMFeSLgWxcXnU/PvluUnPaJQJ/1sekiqYMxpXuseL8qklU5WZadTWmZFfZlZuUYCxYL1+BkzrSuWfS5Ny/T6Y9HWbTerqEZM2YoVkPqpxLcqtbNoMAzzRQWdUOca6Jipc2MGcXUhFl3Zy0tcx1fRrWdzik6wa0BpR1bUQP18PHw3mL38QRW87bjjz1SjasuQKX7hvV8uP+nmuzxJXtdx9z3zqargb7mahOgqiN9onI4+v2OagsKqLCshpp/2yvOkuhjVu+HRjhITS9tpOLH8ygg2wfyqPCpjVS7N0jh2F30xIgFq6xirSg5gZ0o8PRAR/Ae7tpPuw+9am9V4i3Wf3n1o/a1/7W+wj4XQKh0sZL+u6xf21u0x7kgmsDCJ9qp4wLq2FCGqaA9riENwpSusUr+9okp9KnZE4fWrdT1Kml2RjXZckxkWQM3CZskjMufbWfRujp+Mq3wng1UfUAPlBjkFFBxvijbhKjxSEiUVULU0ewWk2WP5FG2KKeHMDV9u5paPhC7N4ieI43UIsoOYarZ00Ie72B0uoLUvruK7+0y2ngwWU99dHL3epofKKDSzXXUfORU5AsofIra99VRRUkBBXILqaot9V6OWLAezH/AlTEkyjz0QIeAAEzTdAHR26oUrlpO68rX2uIDcQDR2kMcZD22UqyALm6og0+0k75V4olK4apHRCk2qY5VZXvlHfQn2ZNc2dRQVoVsikVLzawGWZyQWQ3eJIzLFosWbN6xy9Q9bkQrTHV/v8Vj4GdT3oplouwQOhiyMycXXSFqcWVenEHkp1eubMJ1tP6FEYpFUoSoub5dlBV2t1B7WoSzh+qeb+CreKdnbxlnZ072GpdwO9V8tYgztNRSrbRMCSEeEgTesbZfi73hqIEJYYAhgLGWowuIFBqv6NfVBUdHF4kH878oSg6fmROZOqaCOh45VmRpIxnr3XdNpOZ/upP8d/OUEFnVLWzIpOy1KmRWIqvi7cAkFi0WKZlV2eI1kY0/ddu4/NBv/kDdfeNEtBD429v5uzox2fmFLD8KbY3U3iXKgvBxDmBRtnl0OeXFus2P1lLo/Hk6H8PKHhDtYhDeuZ6q2xL33L+iTvPdTBtFnaTg5ZDWpoxciwid7dQYdQrcQA3/kVAyHFzj7aGOGtfd5Gu0UEi7nzHh6enGEmfKK8ldt4tCPY7/nnd2UdlCv6gBQar6Vi0FU9CsEQsWgh4ZlpplxZsWRgvMM93viZJTD1+YYsmp3o3i7OlIP4Dar1SINlb1GupYZfbllZZv3UkzZ05y1qqkiczKzqikDWVVbCxQtokMC+XT/YPUdvm68Dr2hF+qoK3HPPxNnrWUCleKsk07tRxXQ6aXThxtFmWHohVLSQ2b9BKm2s1bKfiR2B01+nh6tUPJfvzkVwbV8oPmpDIjBx9/ASx3fwHw/ev1OJbQgTr39HRpNdVuWkZ+/uIEvlk8xdxe6fbfWUX7jyavWGnJsBB4apblFYgdMo115d+0xUmuM6GMKVmy6BmRnsXoqCILjra6VxJHmvGpyLFi6hhtrKn4/lXJ7TTzUxNca1autapJFu9bdiY1wDaUWcGyWLDYB7atH44fwcJ0p2aTl8CfTnlfKhJlh+aftUe+5ftC1L5TlG2KaNmC6aI8SnTW0IbtQU8ZYsr0ddDh3Yow56+nypKA2GE6OdOM8QAiJh+FKbi3kdzyPp/m3SOKcemxp+MqeQ9HWSeclUeFXxFlQePxk6LknbQIFtCzrFjowoa1HJmlAZSRoelrPHpAYz0JbaUBrKep4DheKcCUE2KBfZRl+wWLh7eX9Wo7iT5lTISXsaJf+liT4dgTd9D8aWdpEJmVyKaGMis2a+LwzMr+1G1jtWLr7h/7f7AjkKMGXQ2V/yCUMPCnLyygYlG22ddBJ8RCUl/wMDU6RYfVBZR3pyhHY19p5KmWbuIJX3QC3HdRZEJby6n2+OhJVu/BRqpROhNYOp8e5+lx5O6FaMc+D9Nqdbz3Bqhgs3sJP3dTES3ypO9hCreJoiBwzwxRUvHzdURRED7VE+e+RidtguU1y9KFDUGLR/8QFvkyJQIYogXRkOiChXq0le0B/OrrVvCPNSN5DfW9J2Q7ql/ZVrZTieY7EbHGinGqL5HqY02KnUvojf/5c6r27dGyK86ekFUJg2Ahs7KQWSlGbItv48oxJrukgqqXih0m+PwGqg1eFXsxmL6ICp4WZZs6ahdiETrW4AqG0ocXcU42GmTT3z1XTZFHAEGq2lRLHaMyNeyl9gMNogwCVLiQpUp7ahre1kIdI9DM3Cd3Ue26AE8UU+P2qR7P7Eu+k2kTLKAHaDQgEFiv0QUIwayjZkyYNurnSNRMCe289EFuMSWL5VeCen2NKdE1gDwvkX+gvhvmmZ8uIbrQan+KT/x3CX1v4h5nvYqFS65RqWZnVFlscsv/OQwVxo5J91HRpgplcZkD/9tV1CH2ouOj+UvLXOtStW0dnF1orzP4y3g6mGr4eWBeEW3YrPx9eLuKNrwQv+cp0dVMDbtFGeQUUp6d3elPTWupMenXEkAelf04RM3fWTaiVz8u/cGjEPmS/0ySFiwpCAhCaRIZoMhE1DZ65oVjEAosNkcLfOlHrVOPoSxx/EdeKZC+9fMl+gK3bB+tL6jDcaw1Db/m8qG+qHU6qEs0VtQlm73RmyxWH7BY3crlKWz8Sa4KrqWXrv04sk7FImUb6xEmfRb+ZOH/jNCoOSxw5bNGMZiTIaeUtqiBH+bphijGwpe7iIpUxdoTpNAp9+sM/pWLaH6iIcZ7Svj9xxMu1gfWbqEKZYUhzH1PNz1Hm92L250VQy/Qzi9zT+kaftgc/xUDe7wn6fCL6tjwykFBku9g+cnveieOs9t3z4uSSpjO/14UBf552Qnv6zDwL46OB97tOmubV0azbTLtU2FE1/i4y7KOLbasn/JH9yO2erYdbN9lq2R7jqy6n79iTTx80ZpwhO0/L1pZb12yso6yHbtk0X+57dDla8JxYs529ltP0Rmxl4BgteX3+xWrtjpEFeh4Ua3zW2uazjsVV09Y1X/trovYGqsxym07sX2p0ibHKnl6jWu/OigaKpxvUtuwPdloiR4koMOqVs9T+nT1nWrrYVedYjH96/6Ue+HihLXjIXe7+FZk7fq9OJXR73ekP6etXSu1upwSa7/rPg/vo3pPT7ys3n+2lbvYq8b/7bfK1DZs5a1XRaV3ks6wRotEmYrOaLZNpn0qjOgap9YQfcSZ1WQu459ul4ZMayobZ1Rr3lpLf2GdUdapRGYlsirJoT+dQounYRV+HOELUGl5mbKInJiAa9E5TE17lOdd/m9QnvvZyqjhu7+UKp9NpudJEPPdq1i0UN3PvLzgkE2FT7un1RRuouofeX/aGfhSsbKGxxxcT6XPtwz9GE7fOc7c1m0gdfWNcjbS8hSm6eNGsAweOFdJdIXFCp+zNAiVNEwNIVo3Eb3Z8QjlWWed9Sq5ZqUwLsVK4HvwWdqSTODn5FGh8qROJVCy1P3SZSziPSVkK97rZYrno9xntlBZjL6MhOAB9d0rb4RePjj8ZxCj4Fv4DarUViRCL+yg5uHLytGZW0RVL7unzcFtX6NAtnPvsr9QSFUH1PuXSxv/pZRyk9crI1hp4R3XCz+jQ3830XsVdgZlGzIsaTLLuplNCNekK920+QLPGe0/Kta4FisHBH4FlXpe4AhQwZo8UVYJUGH+KGU8sZiSS88+V5r82kw8+trpl/VuwSz+95PD19qOqk8rmfC/0S/j/EB0BD89vq5Cy2qbqXynt586ANkraqjhOwWJF+v9WNhvoLIHUlArJnnBauVv+dd5WtLN3/SXOIhg2MdxgOPYV4MYdTgOcLx+ibNVz5f7QF5D+lTrgOoboB18yvYAbaQf2VfpU70uDGW0l37lVm8D1GvgGPZPt0XqpS95DkyOXe2Puq/6jEWf8I9ECVoDi5VpwTjTuv/iYVdmNcc3gcVq6jgXK8GUPFr/YrHnwM9eWOgOVjD0FO3G4stfT9Wr0ydZvW3Nrnev8BJsXm6UlzTmFlCR6+3/JH4gOqeINmh9Dm+rpUavP57DfwkDT9ZRR6iZap8rpoKF85TPLpty84uotGYXdbQ30sb81F8wSf7XfCHAHqt3grL3NNH02c7xL6x2thCOFVx/+xxnX7ZD4OI8nL+4nKhLBC24Q7S9KIISwB8CeU4+BzgLArZzFjt1uMaaQ04Z/u5f5VwP7eFbXhvCgHNxTIqQ7Kf0LX1iH31C3/eyT/ivnku0nj8x9F0e068N3wDnY3zyHAn6gHHN5escf81pD39A+tT7Fg1MB5FhSfCp4fdLwPoVw+85VSxr4SUu8DAnT6D6e28ZkViZX/NlGGtSnxIiAGXgIRARsAABr+4j+4CoqWKEQEUbGaCHuC324RPiJgVMPy8WECgpUvFQ+wVx0s+B8KlCKutj+Ubf9GvLsp45wa8Ud7TBvcN4JbhP8fCJcyWxMi25AM923e/0BZnVSMXKYBgPpCZYyAggOghwgMBDtoIglIEpswYENQQIJqdCEDVV8GSGBEFBGQKGtghiGdTIlOAT58BQRpvZfF2ch/1oIqSi9hNlCIr0A9BHmQ0C2QbiI/shr636gElhRf+xr/cDbdFPXAuGevQXZTnueEyOMS65pnUTm1zTwloWC1d79tft96zq5xqxMnwySH5KKIMbASeDUh7D9AqBDFMDFmUpAkDWyWPqvmyLYJYZGPZlW1xD74Osl9M7FRyX/tV+AuxDaHAdtZ0sS7/yOkC/tu4TqMd0v6o/lDFOiJlsE49Onm7KtSydKNPDF+75Bf3jn/0V76QHMyU0jDXJC5Zh7MCTwt8tcbbRkKJ1jeh/b3uCZt7PmVsaMYJlGGvMaw2ZBKaFd3E26IuRjWFqiJnfXYvTLlYGw3jACFamcXc50ex6oqliCqrnx/dy3efEU0yD4ROGmRJmOh+2OlPEaSxgsRbm0wSmhGDW57HCbzDceIxgGQyGjMFMCQ0GQ8ZgBMtgMGQMRrAMBkPGYATLYDBkDEawDAZDxmAEy2AwZAxGsAwGQ4ZA9P9cHiea5vB2LgAAAABJRU5ErkJggg==";

const styles = StyleSheet.create({
  page: {
    border: "2px solid #000",
    padding: 20, // Añade padding para que los elementos no estén pegados a los bordes
  },
  img: {
    width: 250,
    height: 40,
    position: "absolute",
    top: 20,
    left: 20,
  },
  br: {
    marginVertical: 10,
  },
  brBig: {
    marginVertical: 25,
  },
  brSmall: {
    marginVertical: 5,
  },
  title: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#000",
    fontStyle: "Nunito Sans",
  },
  titleRight: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#000",
    fontStyle: "Nunito Sans",
    textAlign: "right",
  },
  titleCenter: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#000",
    fontStyle: "Nunito Sans",
    textAlign: "center",
  },
  titleLeft: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#000",
    fontStyle: "Nunito Sans",
    textAlign: "left",
  },
  subTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#000",
    fontStyle: "Nunito Sans",
  },
  parrafo: {
    fontSize: 12,
    fontStyle: "Nunito Sans",
    color: "black",
    marginTop: "1.5",
  },
  columna: {
    display: "flex",
    flexDirection: "column",
  },
  columnaLeft: {
    display: "flex",
    flexDirection: "column",
    textAlign: "left",
    justifyContent: "space-between",
    alignItems: "flex-start",
    padding: 10,
    width: "50%",
  },
  columnaRight: {
    display: "flex",
    flexDirection: "column",
    textAlign: "right",
    justifyContent: "space-between",
    alignItems: "flex-end",
    padding: 10,
    width: "50%",
  },
  fila: {
    display: "flex",
    flexDirection: "row",
  },
  table: {
    width: "100%",
    border: "1px solid #000",
  },
  tableRow: {
    flexDirection: "row",
    borderBottom: "1px solid #000",
    width: "100%",
  },
  tableColHeader: {
    width: "20%",
    borderRight: "1px solid #000",
    backgroundColor: "#f0f0f0",
  },
  tableCol: {
    width: "20%",
    borderRight: "1px solid #000",
  },
  tableCellHeader: {
    margin: 5,
    fontSize: 10,
    fontWeight: "bold",
  },
  tableCell: {
    margin: 5,
    fontSize: 10,
  },

  lineaLeft: {
    borderBottom: "2px solid #000",
    width: "70%",
    alignSelf: "flex-start",
    marginVertical: 20,
  },
  textoDebajoLineaLeft: {
    textAlign: "left",
    fontSize: 12,
    fontStyle: "Nunito Sans",
    color: "black",
    marginTop: 2,
  },
  lineaRight: {
    borderBottom: "2px solid #000",
    width: "70%",
    alignSelf: "flex-end",
    marginVertical: 20,
  },
  textoDebajoLineaRight: {
    textAlign: "right",
    fontSize: 12,
    fontStyle: "Nunito Sans",
    color: "black",
    marginTop: 2,
  },
  header: {
    position: "absolute",
    top: 20,
    right: 20,
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
  },
});

export default function PDFSinOrden(props: props) {
  return (
    <>
      <Document>
        <Page style={styles.page}>
          <Image style={styles.img} src={LogoNetCoreBase64} />
          <View style={styles.header}>
            <Text style={styles.titleRight}>
              Folio Recepcion Nro: {props.data.folio}
            </Text>
            <Text style={styles.titleRight}>
              Fecha:{" "}
              {props.data.fecha.toLocaleDateString("es-ES", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </Text>
          </View>

          <View style={styles.brBig}></View>

          <View style={styles.columna}>
            <Text style={styles.titleCenter}>
              Recepcion sin orden de compra
            </Text>

            <View style={styles.br}></View>

            <View style={styles.fila}>
              <View style={styles.columnaLeft}>
                <View style={styles.fila}>
                  <Text style={styles.subTitle}>CENTRO DE COSTO</Text>
                </View>
                <Text style={styles.parrafo}>{props.location.centrocosto}</Text>
                <View style={styles.brSmall}></View>

                <View style={styles.fila}>
                  <Text style={styles.subTitle}>BODEGA</Text>
                </View>
                <Text style={styles.parrafo}>{props.location.bodega}</Text>
                <View style={styles.brSmall}></View>

                {/* <View style={styles.fila}>
                                    <Text style={styles.subTitle}>RUT PROVEEDOR</Text>
                                </View>
                                <Text style={styles.parrafo}>78.936.310-2</Text>
                                <View style={styles.brSmall}></View> */}

                <View style={styles.fila}>
                  <Text style={styles.subTitle}>FECHA DEL DOCUMENTO</Text>
                </View>
                <Text style={styles.parrafo}>
                  {props.data.fechaDoc.toLocaleDateString("es-ES", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </Text>
              </View>

              <View style={styles.columnaRight}>
                {/* <View style={styles.fila}>
                                    <Text style={styles.subTitle}>AREA</Text>
                                </View>
                                <Text style={styles.parrafo}>Salud</Text>
                                <View style={styles.brSmall}></View> */}

                {/* <View style={styles.fila}>
                                    <Text style={styles.subTitle}>RUT DEL ENCARGADO DE BODEGA</Text>
                                </View>
                                <Text style={styles.parrafo}>12.587.987-3</Text>
                                <View style={styles.brSmall}></View> */}

                {/* <View style={styles.fila}>
                                    <Text style={styles.subTitle}>ENCARGADO DE BODEGA</Text>
                                </View>
                                <Text style={styles.parrafo}>Juan Gonzales</Text>
                                <View style={styles.brSmall}></View> */}

                {/* <View style={styles.fila}>
                                    <Text style={styles.subTitle}>PROVEEDOR</Text>
                                </View>
                                <Text style={styles.parrafo}>Neumann LTDA</Text>
                                <View style={styles.brSmall}></View> */}
                <View style={styles.fila}>
                  <Text style={styles.subTitle}>TIPO DE DOCUMENTO</Text>
                </View>
                <Text style={styles.parrafo}>
                  {props.data.tipo == 2 ? "Guia de despacho" : "Factura"}
                </Text>
                <View style={styles.brSmall}></View>
                <View style={styles.fila}>
                  <Text style={styles.subTitle}>NUMERO DE DOCUMENTO</Text>
                </View>
                <Text style={styles.parrafo}>{props.data.numDoc}</Text>
              </View>
            </View>

            <View style={styles.br}></View>

            <View style={styles.table}>
              <View style={styles.tableRow}>
                <View style={styles.tableColHeader}>
                  <Text style={styles.tableCellHeader}>Código Artículo</Text>
                </View>
                <View style={styles.tableColHeader}>
                  <Text style={styles.tableCellHeader}>
                    Descripción Artículo
                  </Text>
                </View>
                <View style={styles.tableColHeader}>
                  <Text style={styles.tableCellHeader}>
                    Cantidad en almacen
                  </Text>
                </View>
                <View style={styles.tableColHeader}>
                  <Text style={styles.tableCellHeader}>Precio Compra</Text>
                </View>
                <View style={styles.tableColHeader}>
                  <Text style={styles.tableCellHeader}>Cantidad Recibida</Text>
                </View>
              </View>
              {props.data.articulos.map((articulo, index) => (
                <View style={styles.tableRow} key={index}>
                  <View style={styles.tableCol}>
                    <Text style={styles.tableCell}>{articulo.codigo}</Text>
                  </View>
                  <View style={styles.tableCol}>
                    <Text style={styles.tableCell}>{articulo.nombre}</Text>
                  </View>
                  <View style={styles.tableCol}>
                    <Text style={styles.tableCell}>
                      {articulo.cantidadAlmacen}
                    </Text>
                  </View>
                  <View style={styles.tableCol}>
                    <Text style={styles.tableCell}>{articulo.valor}</Text>
                  </View>
                  <View style={styles.tableCol}>
                    <Text style={styles.tableCell}>{articulo.cantidad}</Text>
                  </View>
                </View>
              ))}
            </View>

            <View style={styles.brBig}></View>

            <View style={styles.fila}>
              <View style={styles.columnaLeft}>
                <View style={styles.fila}>
                  <View style={styles.lineaLeft}></View>
                </View>
                <Text style={styles.textoDebajoLineaLeft}>
                  Nombre y Firma Encargado de Recepción
                </Text>
              </View>

              <View style={styles.columnaRight}>
                <View style={styles.fila}>
                  <View style={styles.lineaRight}></View>
                </View>
                <Text style={styles.textoDebajoLineaRight}>
                  Nombre y Firma Encargado de Salida
                </Text>
              </View>
            </View>
          </View>
        </Page>
      </Document>
    </>
  );
}
