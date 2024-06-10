import { custom } from "zod";

function isValidRUT(rut: string): boolean {
    // Eliminar puntos y guión del RUT
    rut = rut.replace(/\./g, '').replace(/\-/g, '');

    // Extraer el dígito verificador
    const dv = rut.slice(-1);
    rut = rut.slice(0, -1);

    // Calcular dígito verificador esperado
    let sum = 0;
    let multiplier = 2;
    for (let i = rut.length - 1; i >= 0; i--) {
        sum += parseInt(rut[i]) * multiplier;
        if (multiplier === 7) {
            multiplier = 2;
        } else {
            multiplier++;
        }
    }
    const expectedDV = (11 - (sum % 11)) % 11;

    // Comparar dígito verificador esperado con el ingresado
    return dv.toUpperCase() === (expectedDV === 10 ? 'K' : expectedDV.toString());
}

const zodRut = custom((value: unknown) => {
    return (typeof value !== "string" || !isValidRUT(value))
});

const nullableNumber = ((numero:any) =>{ 
    if (isNaN(Number(numero))) return null
    return Number(numero)
  })

function formatRut(rut:string) {
    // Eliminar puntos y guión existentes
    rut = rut.replace(/\./g, "").replace(/-/g, "");
  
    // Formatear el RUT con puntos y guión
    rut = rut.replace(/^(\d{1,3})(\d{3})(\d{3})(\w{1})$/, "$1.$2.$3-$4");
  
    return rut;
  }

  const allowOnlyNumber=(value:string)=>{
    return value.replace(/[^0-9]/g, '')
 }
  
export {isValidRUT,formatRut,zodRut,nullableNumber,allowOnlyNumber}