import Configstore from "configstore";
import clear from "clear";

$.verbose = false;

clear();
console.log("Set up environment...");

const projectName = "oraref";

const config = new Configstore(projectName, { project_name: projectName });

const baseFolder = (await $`pwd`).stdout.trim();
config.set("base_folder", baseFolder);

config.set("db_password", await generateRandomPassword());

console.log(`Configuration write on ${chalk.green(config.path)}`);

async function generateRandomPassword(length = 22) {
  const { stdout } = await $`openssl rand -base64 100`;
  const cleanPassword = stdout
    .trim()
    .replaceAll("/", "")
    .replaceAll("=", "")
    .replaceAll("+", ""); // +
  const finalPassword = cleanPassword.slice(0, length);
  return finalPassword;
}
