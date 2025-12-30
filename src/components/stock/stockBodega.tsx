import React, { useEffect, useState } from "react";
import {
  Document,
  Text,
  Page,
  StyleSheet,
  View,
  PDFDownloadLink,
} from "@react-pdf/renderer";
import { Button } from "react-daisyui";

interface DataI {
  id: string;
  nombre: string;
  codigo: string | null;
  collection: {
    codigo: string;
    stockMin: number;
    nombre: string;
    cantidad: number;
    id: string;
  }[];
}

interface Iprops {
  data: DataI;
}

export const StockPDF = ({ data }: { data: DataI }) => {
  const styles = StyleSheet.create({
    page: {
      padding: 35,
      fontSize: 11,
      fontFamily: "Helvetica",
      color: "#111827",
    },
    header: {
      marginBottom: 15,
      borderBottomWidth: 1,
      borderBottomColor: "#E5E7EB",
      paddingBottom: 5,
    },
    title: {
      fontSize: 16,
      fontWeight: "bold",
      color: "#1F2937",
    },
    subtitle: {
      fontSize: 11,
      color: "#4B5563",
    },
    table: {
      width: "100%",
      borderWidth: 1,
      borderColor: "#D1D5DB",
      marginTop: 15,
    },
    row: {
      flexDirection: "row",
      borderBottomWidth: 1,
      borderBottomColor: "#E5E7EB",
      alignItems: "center",
    },
    headerRow: {
      backgroundColor: "#F3F4F6",
    },
    cell: {
      flex: 1,
      paddingVertical: 6,
      paddingHorizontal: 4,
      textAlign: "center",
    },
    headerText: {
      fontWeight: "bold",
      fontSize: 11,
      color: "#374151",
    },
    cellText: {
      fontSize: 10,
      color: "#111827",
    },
    okText: {
      color: "#16A34A",
      fontWeight: "bold",
    },
    lowText: {
      color: "#DC2626",
      fontWeight: "bold",
    },
    emptyMessage: {
      marginTop: 40,
      textAlign: "center",
      color: "#6B7280",
      fontStyle: "italic",
    },
  });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>Reporte de stock</Text>
          <Text style={styles.subtitle}>{data.nombre}</Text>
          <Text style={styles.subtitle}>Código: {data.codigo ?? "—"}</Text>
        </View>

        {data.collection.length === 0 ? (
          <Text style={styles.emptyMessage}>
            No hay registros de stock disponibles.
          </Text>
        ) : (
          <View style={styles.table}>
            {/* Encabezado */}
            <View style={[styles.row, styles.headerRow]}>
              <Text style={[styles.cell, styles.headerText]}>Código</Text>
              <Text style={[styles.cell, styles.headerText]}>Nombre</Text>
              <Text style={[styles.cell, styles.headerText]}>Stock Mínimo</Text>
              <Text style={[styles.cell, styles.headerText]}>Cantidad</Text>
              <Text style={[styles.cell, styles.headerText]}>Estado</Text>
            </View>

            {/* Filas */}
            {data.collection.map((almacen) => {
              const bajoStock = almacen.cantidad < almacen.stockMin;
              return (
                <View style={styles.row} key={almacen.id}>
                  <Text style={styles.cell}>{almacen.codigo}</Text>
                  <Text style={styles.cell}>{almacen.nombre}</Text>
                  <Text style={styles.cell}>{almacen.stockMin}</Text>
                  <Text style={styles.cell}>{almacen.cantidad}</Text>
                  <Text
                    style={[
                      styles.cell,
                      bajoStock ? styles.lowText : styles.okText,
                    ]}
                  >
                    {bajoStock ? "Bajo stock" : "OK"}
                  </Text>
                </View>
              );
            })}
          </View>
        )}
      </Page>
    </Document>
  );
};

// === Componente principal ===
export default function StockBodega({ data }: Iprops) {
  const [isFiltering, setIsfiltering] = useState(true);
  const [filteringData, setFilteringData] = useState<DataI | undefined>();

  const filterFunction = (isFiltering: boolean) => {
    if (isFiltering) {
      const newFilteringCollection = data.collection.filter(
        (e) => e.cantidad < e.stockMin,
      );
      setFilteringData({ ...data, collection: newFilteringCollection });
    }

    if (!isFiltering) {
      setFilteringData({ ...data });
    }
  };

  useEffect(() => {
    filterFunction(isFiltering);
  }, [data, isFiltering]);
  if (!filteringData) return;
  return (
    <div className="rounded-2xl shadow-sm border border-gray-100 p-4 w-full h-full mt-4 bg-white mr-4 ml-2">
      {/* Encabezado con botón PDF */}
      <div className="mb-5 border-b border-gray-200 pb-3 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">{data.nombre}</h2>
          <p className="text-left text-sm text-gray-500">
            Código:{" "}
            <span className="font-medium text-gray-700">
              {data.codigo ?? "—"}
            </span>
          </p>
        </div>
        <div>
          <Button
            onClick={() => {
              setIsfiltering((prev) => !prev);
            }}
            className="btn-primary mr-2"
          >
            {isFiltering ? "Mostrar Todo" : "Filtrar campos con bajo stock"}
          </Button>
          {filteringData.collection.length != 0 && (
            <PDFDownloadLink
              document={<StockPDF data={filteringData} />}
              fileName={`Stock_${data.nombre.replace(/\s+/g, "_")}.pdf`}
              className="bg-primary hover:bg-primary/50 text-white text-sm px-4 py-2 rounded-lg shadow-sm transition-colors btn join-item"
            >
              {({ loading }) => (loading ? "Generando..." : "Exportar PDF")}
            </PDFDownloadLink>
          )}
        </div>
      </div>

      {/* Tabla en pantalla */}
      <div className="flex-grow overflow-auto ">
        {filteringData.collection.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500 text-sm italic">
            No hay registros de stock disponibles.
          </div>
        ) : (
          <table className="w-full text-sm border border-gray-200 rounded-lg bg-white">
            <thead className="bg-gray-100 text-gray-700 sticky top-0">
              <tr>
                <th className="py-2 px-4 text-center font-medium">Código</th>
                <th align="center" className="py-2 px-4 text-left font-medium">
                  Nombre
                </th>
                <th className="py-2 px-4 text-right font-medium">
                  Stock Mínimo
                </th>
                <th className="py-2 px-4 text-right font-medium">Cantidad</th>
                <th className="py-2 px-4 text-center font-medium">Estado</th>
              </tr>
            </thead>
            <tbody>
              {filteringData.collection.map((almacen) => {
                const bajoStock = almacen.cantidad < almacen.stockMin;
                return (
                  <tr
                    key={almacen.id}
                    className="border-t border-gray-200 hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-2 px-4 text-gray-800">
                      {almacen.codigo}
                    </td>
                    <td align="left" className="py-2 px-4 text-gray-800">
                      {almacen.nombre}
                    </td>
                    <td className="py-2 px-4 text-right text-gray-700">
                      {almacen.stockMin}
                    </td>
                    <td className="py-2 px-4 text-right text-gray-700">
                      {almacen.cantidad}
                    </td>
                    <td className="py-2 px-4 text-center">
                      {bajoStock ? (
                        <span className="text-xs font-medium text-red-600 bg-red-50 px-2 py-1 rounded-full">
                          Bajo stock
                        </span>
                      ) : (
                        <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                          OK
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
