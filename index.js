/**
 * CMCC Henan modem (GM220-S) restarter
 */
const axios = require("axios");
const qs = require("qs");
const { ip, user, pass } = require("./config.json");
global.navigator = { appName: "nodejs" }; // fake the navigator object
global.window = {}; // fake the window object
const JSEncrypt = require("jsencrypt");

function encryptPassword(password) {
  var encrypt = new JSEncrypt();
  encrypt.setPublicKey(
    "MIGdMA0GCSqGSIb3DQEBAQUAA4GLADCBhwKBgQDrQunyHq5EGzlc6GFZ+LJrvnZ5+Jd8ArqgR6xvuBTNtqbPDz1NfnMTuusny1etUUY3UUPckEH2SVClSxYZTuy9T5OXsUP+9CimcZ7ft/WuabcOkvw/WoAkzJwOySVUNxRDGhDTS59tZhQ11C42WIpdD+vDELH4OcQ7XrlLA/mHbwIBAw=="
  );
  return encrypt.encrypt(password);
}

async function main() {
  const LOGIN_RES = await axios({
    method: "POST",
    url: `http://${ip}/`,
    headers: {
      "content-type": "application/x-www-form-urlencoded",
    },
    data: qs.stringify({
      frashnum: "",
      action: "login",
      Frm_Logintoken: "1",
      username: user,
      logincode: encryptPassword(pass),
      usr: encryptPassword(pass),
      ieversion: "1",
    }),
  });
  const ADMIN_LOG_TOKEN = /A[0-9]{16}/.exec(LOGIN_RES.data)[0];
  console.log("ADMIN_LOG_TOKEN:", ADMIN_LOG_TOKEN);
  const TEMPLATE_RES = await axios({
    method: "GET",
    url: `http://${ip}/template.gch`,
    headers: {
      cookie: `USER_LOG_TOKEN=0; ADMIN_LOG_TOKEN=${ADMIN_LOG_TOKEN}`,
    },
  });
  const SESSION_TOKEN = /A[0-9]{16}/.exec(TEMPLATE_RES.data)[0];
  console.log("SESSION_TOKEN:", SESSION_TOKEN);
  const RESTART_RES = await axios({
    method: "POST",
    url: `http://${ip}/getpage.gch?pid=1002&nextpage=manager_dev_restart_t.gch`,
    headers: {
      "content-type": "application/x-www-form-urlencoded",
      cookie: `USER_LOG_TOKEN=0; ADMIN_LOG_TOKEN=${ADMIN_LOG_TOKEN}`,
    },
    data: qs.stringify({
      IF_ACTION: "devrestart",
      IF_ERRORSTR: "SUCC",
      IF_ERRORPARAM: "SUCC",
      IF_ERRORTYPE: "-1",
      flag: "1",
      _SESSION_TOKEN: SESSION_TOKEN,
    }),
  });
  console.log(
    "success:",
    /Transfer_meaning\('flag','1'\)/.test(RESTART_RES.data)
  );
}

main();
