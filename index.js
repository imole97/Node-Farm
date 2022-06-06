const fs = require('fs')
const http = require('http')
const url = require('url')
const replaceTemplate = require('./modules/replaceTemplate')
//the fs module returns an object that is stored in the fs variable
// readFileSync takes in file path, and character encoding to prevent buffer output

//BLOCKING CODE
// const textIn = fs.readFileSync('./txt/input.txt', 'utf-8' )
// console.log(textIn);

// const textOut = `This is what we know about the avocado: ${textIn}`
// fs.writeFileSync('./txt/output.txt', textOut)
// console.log('file written')

// //NON BLOCKING CODE
// fs.readFile('./txt/start.txt/', 'utf-8', (err, data1) => {
//     fs.readFile(`./txt/${data1}.txt/`, 'utf-8', (err, data2) => {
//         console.log(data2)
//         fs.readFile(`./txt/append.txt/`, 'utf-8', (err, data3) => {
//             console.log(data3)
//             fs.writeFile('./txt/final.txt/',`${data2}\n${data3}`, 'utf-8', err => {
//                 err? console.log(err): console.log('file written successfully 😁 ')
//             } )
//         })
//     })
// })
// console.log('reading file...');





////////////////////////////////////////////////
//SERVER
const replaceTemplate = (temp, product) => {
    let output =  temp.replace(/{%PRODUCTNAME%}/g, product.productName)
    output  =  output.replace(/{%IMAGE%}/g, product.image)
    output  =  output.replace(/{%PRICE%}/g, product.price)
    output  =  output.replace(/{%FROM%}/g, product.from)
    output  =  output.replace(/{%NUTRIENTS%}/g, product.nutrients)
    output  =  output.replace(/{%QUANTITY%}/g, product.quantity)
    output  =  output.replace(/{%DESCRIPTION%}/g, product.description)
    output  =  output.replace(/{%ID%}/g, product.id)

    if(!product.organic) {output = output.replace(/{%NOT_ORGANIC%}/g, 'not-organic')}

    console.log(output)
    return output
    
}

const tempOverview = fs.readFileSync(`${__dirname}/template/template-overview.html`, 'utf-8')
const tempCard = fs.readFileSync(`${__dirname}/template/template-card.html`, 'utf-8')
// console.log(tempCard)
const tempProduct = fs.readFileSync(`${__dirname}/template/template-product.html`, 'utf-8')


//using sync because the code executes once and we want to assign the outcome to a variable
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8')
const dataObj = JSON.parse(data) 
            
//create a server
const server = http.createServer((req, res) => {
    
    const {query, pathname} = url.parse(req.url, true)
    
    
    //OVERVIEW PAGE
    if (pathname === '/' || pathname === '/overview'){
        res.writeHead(200, { 'Content-type': 'text/html'})
        const cardsHtml = dataObj.map(data => replaceTemplate(tempCard,data)).join('')
        const output  =  tempOverview.replace('{%PRODUCT_CARDS%}', cardsHtml)
        res.end(output)
    
    //PRODUCT PAGE    
    }else if(pathname === '/product'){
        res.writeHead(200, {'Content-type': 'text-html'})
        const product = dataObj[query.id]
        const output = replaceTemplate(tempProduct, product)
        res.end(output)
    
    //API
    }else if (pathname === '/api'){
        res.writeHead(200, {'Content-type': 'applcation/json'})
        res.end(data)
    
    //NOT FOUND
    }else{
        res.writeHead(404, {
            'Content-type': 'text-html'
        })
        res.end('<h1>Page not found</h1>')
    }
})


// listen to requests, listen takes in port and host ip address and an optional callback that executes when 
//server starts listening
server.listen(5000, '127.0.0.1', () => {
    console.log('listening to requests on port 5000')
})



// every file in Node.js is treated as a module
//http header is a piece of info about the reponse the server sends
///http headers should be declared before sending server response
//dot in './' indicates where the script is running except when using require and __dirname is where the current file is located
//JSON.parse converts JSON to JavaScript object
//it is good to read file synchronously at the top level of our code since the files will be run once when the application loads 
// url.parse() parses the variables out of a url. i.e "id = 0 " the variable in "/product?id=0" 
//url.parse takes in true as parameter to make the query "id=0" an object
