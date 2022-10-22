import Handlebars from "handlebars";
import fs from "fs/promises";

const getTemplate = async (templateName: string) => {
  const notificationFilePath = `${__dirname}/../templates/${templateName}.handlebars`;
  const notificationFile = await fs.readFile(notificationFilePath, "utf8");
  return Handlebars.compile(notificationFile);
};

export default getTemplate;
