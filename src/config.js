const debug = require("debug")("static:config");
const path = require("path");
const config = {
    host:"localhost", //监听的主机
    port:8080,   //端口号
    root:process.cwd()  //静态文件根目录
}
debug(config);
module.exports = config;