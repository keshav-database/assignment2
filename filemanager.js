const http=require('http');   //for remote or browser based access
const fs=require('fs');      //for using file system operations
const url=require('url');    //to use url module functionalities which will be helpful in switch case
const path=require('path');  //for safe cross platform path handling

const port=3000;


const base_Dir=path.join(__dirname,'keshav_files');

if(!fs.existsSync(base_Dir)){
    fs.mkdirSync(base_Dir);
}

const server=http.createServer(function(req,res){
    const parsedUrl=url.parse(req.url,true);
    const pathname=parsedUrl.pathname;
    const query=parsedUrl.query;
    const filename=parsedUrl.query.filename;

    if( ! filename){
    res.writeHead(400,{'Content-Type':'text/plain'});
    res.end("Filename is required");
}
const filePath=path.join(base_Dir,filename);
  switch (pathname) {
        case '/create':
            if (req.method === 'POST') {
                let body = '';
                req.on('data', chunk => {
                    body += chunk;
                });
                req.on('end', function(){
                    fs.writeFile(filePath, body, err => {
                        if (err) {
                            res.writeHead(500);
                            return res.end('Error writing file');
                        }
                        res.writeHead(200);
                        res.end('File created successfully');
                    });
                });
            } else {
                res.writeHead(405);
                res.end('Method Not Allowed');
            }
            break;

        case '/read':
            if (req.method === 'GET') {
                fs.readFile(filePath, 'utf-8',function (err, data) {
                    if (err) {
                        res.writeHead(404);
                        return res.end('File not found');
                    }
                    res.writeHead(200, { 'Content-Type': 'text/plain' });
                    res.end(data);
                });
            } else {
                res.writeHead(405);
                res.end('Method Not Allowed');
            }
            break;

        case '/delete':
            if (req.method === 'DELETE') {
                fs.unlink(filePath, err=> {
                    if (err) {
                        res.writeHead(404);
                        return res.end('File not found or cannot delete');
                    }
                    res.writeHead(200);
                    res.end('File deleted successfully');
                });
            } else {
                res.writeHead(405);
                res.end('Method Not Allowed');
            }
            break;

        default:
            res.writeHead(404);
            res.end('Invalid route');
            break;
    }



});

server.listen(port, () => {
    console.log(`Server is listening on http://localhost:${port}`);
});
 