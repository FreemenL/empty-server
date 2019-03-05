const config = require("./config");
const chalk = require("chalk");
const http = require("http");
const path = require("path");
const mime = require("mime");
const url = require("url");
const fs = require("fs");
const handlebars = require("handlebars");

const  { promisify ,inspect } = require("util");
const stat = promisify(fs.stat);
const readdir = promisify(fs.readdir);
//编译模版，得到一个渲染的方法 然后传入实际的数据就可以得到渲染后的HTML了 
function list(){
    const tmp = fs.readFileSync(path.resolve(__dirname,"template","index.html"),"utf8");
    return handlebars.compile(tmp);
}
//每个debug实例都有一个名字 ，是否在控制台打印 取决于环境变量中的DEBUG的值是否等于static：app
//static：app 项目名：模块名
const debug = require("debug")("static:app");

class Server {
    constructor(argv){
        this.list = list();
        this.config = Object.assign({},config,argv);
    }
    start(){
        const server = http.createServer();
        server.on("request",this.request.bind(this));
        server.listen(this.config.port,()=>{
            let url = `http://${this.config.host}:${this.config.port}`;
            debug(`server started at: ${chalk.green(url)}`)
        })
    }
    proxyRequest(req,res,redirect){
        console.log(redirect);
        let options = url.parse(redirect);
            options.headers = req.headers;
            console.log(options)
        const proxyRequest = http.request(options, function(proxyResponse) {     //代理请求获取的数据再返回给本地res
            proxyResponse.on('data', function(chunk) {
                console.log('proxyResponse length:', chunk.length);
                res.write(chunk, 'binary');
            });
            //当代理请求不再收到新的数据，告知本地res数据写入完毕。
            proxyResponse.on('end', function() {
              console.log('proxied request ended');
              res.end();
            });
        
            res.writeHead(proxyResponse.statusCode, proxyResponse.headers);
          });
        req.on('data', function(chunk) {
            console.log('in request length:', chunk.length);
            proxyRequest.write(chunk, 'binary');
        });
    
        req.on('end', function() {
            //向proxy发送求情，这里end方法必须被调用才能发起代理请求
            //所有的客户端请求都需要通过end来发起
            proxyRequest.end();
        });
    }
    async request(req,res){
        //获取到客户端想要访问的路径
        const { pathname } = url.parse(req.url);
        const proxy = this.config.P || this.config.proxy;
        if(pathname=="/favicon.ico"){
            return this.sendError(req,res);
        }
        if(proxy&&(!pathname.includes("."))){
            return this.proxyRequest(req,res,proxy+pathname);
        }
        const filepath = path.join(this.config.root,pathname);
        try{
            let statObj = await stat(filepath);
            if(statObj.isDirectory()){
                let files = await readdir(filepath);
                files = files.map(file=>{
                    return{
                        name:file,
                        url:path.join(pathname,file)
                    }
                });
                let html = this.list({
                    title:pathname,
                    files
                })
                res.setHeader("Content-Type","text/html");
                res.end(html);
            }else{
                this.sendFile(req,res,filepath,statObj);
            }

        }catch(error){
            debug(inspect(error));
            this.sendError(req,res);
        }

    }
    sendFile(req,res,filepath,statObj){
        res.setHeader("Content-Type",mime.getType(filepath));
        fs.createReadStream(filepath).pipe(res);
    }
    sendError(req,res){
        res.statusCode = 500;
        res.end("there is something wrong in the server! please try later!");
    }
}
module.exports = Server;

