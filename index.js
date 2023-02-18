require("dotenv").config();
const axios = require("axios");
const fs = require("fs");
const path = require("path");

const USERNAME = process.env.USERNAME;
const USERID = process.env.USERID;

if (!USERNAME || USERNAME.length <= 0 || USERNAME == "") return missingConfigure();
if (!USERID || USERID.length <= 0 || USERID == "") return missingConfigure();

function missingConfigure() {
	console.log("USERNAME or USERID is not configure");
	console.log("Please enter your USERNAME or USERID in .env file and start again.")
	process.exit(1);
}

const CODES_PATH = path.join(__dirname, "codes.txt");
const DEF_CODES_PATH = path.join(__dirname, "default_codes.txt");
let codes;

function parseCodes(data) {
	return data.split("\n").map(code => code.replace(/ +/g, ""));
}

if (fs.existsSync(CODES_PATH)) {
	console.log("codes.txt exists > reading...");
	codes = fs.readFileSync(CODES_PATH, "utf-8");
	codes = parseCodes(codes);
} else {
	console.log("codes.txt not exists > creating new one...");
	let def_codes = fs.readFileSync(DEF_CODES_PATH, "utf-8");
	fs.writeFileSync(CODES_PATH, def_codes);
	codes = parseCodes(def_codes);
}

console.log(`
-== USER DATA ==-
Username: ${process.env.USERNAME}
UserID: ${process.env.USERID}
`);

(async () => {
	if (codes.length > 0) {
		for (let code of codes) {
			console.log(`Trying code: "${code}"...`);
			let data;
			try {		
				data = await axios.post(
					"https://p10527-game-adapter.qookkagames.com/cms/active_code/change",				
					{							
						player_id: process.env.USERID,						
						player_name: process.env.USERNAME,
						code: code			
					}
				);
			} catch (ex) {
				console.log(ex);
			}
			console.log(`${code}: (error?: ${data.data.error ? "true": "false"}) ${data.data.message}`);
			console.log(`-==-==-`)
		}
	} else console.log("there're no code for redeem");
})();