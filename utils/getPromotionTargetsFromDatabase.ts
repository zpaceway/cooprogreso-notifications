import readXlsxFile from "read-excel-file/node";
import { Cell } from "read-excel-file/types";
import PromotionTarget from "../interfaces/PromotionTarget";
import getNameFromSriApi from "./getNameFromSriApi";

const cleanCell = (cell: Cell) => {
  return (cell?.toString() || "").trim();
};

const errorCode = "#ERROR_#N/A";

const getPromotionTargetsFromDatabase = async (database: string) => {
  const databasePath = `${__dirname}/../databases/${database}`;
  const rows = await readXlsxFile(databasePath);
  const promotionTargets: PromotionTarget[] = await Promise.all(
    rows.slice(2).map(async (row) => {
      const possibleName = cleanCell(row[3]);
      const identificationNumber = cleanCell(row[2]);
      const name =
        possibleName === errorCode
          ? await getNameFromSriApi(identificationNumber)
          : cleanCell(row[3]);
      const amountString = cleanCell(row[7]);

      return {
        name,
        identificationNumber,
        amount: parseInt(amountString),
        internationalPhoneNumbers: [
          ...new Set(
            row
              .slice(14)
              .filter((cell) => !!cell)
              .map((cell) => cleanCell(cell))
              .map((number) => `593${parseInt(number)}`)
          ),
        ],
      };
    })
  );
  return promotionTargets;
};

export default getPromotionTargetsFromDatabase;
