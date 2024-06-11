# ming 
Ming is a distributed cloud platform for hosting JS frameworks. This contains the nightly builds and the tech is bleeding edge. 

### Getting Started:
I personally use Node.js on top of Bun.js for development though native components from Bun.js is not yet utilized so should work on Node.js too. 

```bash
bun install
```

**Usage**
To start a main genesis server you can use either bun which is technically faster environment or node, whichever is good.
```bash
bun server.js || node server.js
```
you can expect the following output:
```console
lexy@Lex-World:~/Documents/projects/ming$ bun server.js 
JSON-RPC server is running on port 3000
```
Now, as client nodes you can open many terminals acting as nodes and to start use
```bash
bun client.js || node client.js
```
you can expect the output like:
```console
lexy@Lex-World:~/Documents/projects/ming$ bun client.js 
Connected to the relay server
Server response: this is a test!
```
 NGINX Working directory:
 ```bash
sudo nano /etc/nginx/sites-available/tcp_server
 ```

 Connecting to server using SSH Tuneling for TCP. Note: Make sure the JSON Request generates error while connecting using SSH.
 ```bash
sudo ssh -L 3000:localhost:3000 user@192.168.2.27 -p 3000
 ```