import axios from "axios";

const getNameFromSriApi = async (identificationNumber: string) => {
  try {
    const url = `https://srienlinea.sri.gob.ec/movil-servicios/api/v1.0/deudas/porIdentificacion/${identificationNumber}`;
    return (await axios.get(url)).data.contribuyente.nombreComercial;
  } catch {
    return "cliente";
  }
};

export default getNameFromSriApi;
