import Configstore from "configstore";
import clear from "clear";

$.verbose = false;

clear();
console.log("Clean up config files, certs, ssh keys...");

const projectName = "oraref";

const config = new Configstore(projectName, { project_name: projectName });

config.clear();
console.log(`${chalk.green("Config file")} deleted`);
