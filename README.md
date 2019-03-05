
<div align="center">
  <a href="http://nodejs.cn/">
    <img width="400" height="200"
      src="http://img0.imgtn.bdimg.com/it/u=491865045,1211705331&fm=26&gp=0.jpg">
  </a>
  <h1>emptyd-server</h1>
  <p>emptyd-server is a simple, zero-configuration command-line http server. It is powerful enough for production usage, but it's simple and hackable enough to be used for testing, local development, and learning.</p>
</div>

<h2 align="center">Install</h2>

```bash
  cnpm install emptyd-server -g
```

```bash
  npm install emptyd-server -g
```

<h2 align="center">Zero Config</h2>

The `emptyd-server` works without configuration.  

<h2 align="center">Usage</h2>

Static Resource Services

```
"emptyd-server -d / -p 8080 -o localhost -P http://129.204.139.211"

```

<h2 align="center">Options</h2>

You can pass a hash of configuration options to `emptyd-server`.
Allowed values are as follows

|Name|Type|Default|Description|
|:--:|:--:|:-----:|:----------|
|**`p|port`**|`{number}`|8080|port is used to specify the port of the service|
|**`P|proxy`**|`{String}`||proxy is used to configure proxies for services|
|**`o|host`**|`{string}`|`loclhost`|host is used to configure monitored hosts|
|**`d|root`**|`{string}`|"process.cwd()"|root is used to configure the static file root directory|

<h2 align="center">Maintainers</h2>

<table>
  <tbody>
    <tr>
      <td align="center">
        <img width="150" height="150"
        src="https://www.lgstatic.com/i/image/M00/70/45/CgpEMlm1eoaAT-7PAACXDPj8MC493.jpeg">
        </br>
        <a href="https://github.com/freemenL">freemenL</a>
      </td>
    </tr>
  <tbody>
</table>
