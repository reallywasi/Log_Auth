import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
const app=express();

app.use(express.json());


app.use(cors());

//morgan ==> library to log all the http request inside the console

app.use(morgan('tiny'));
app.disable('x-powered-by') // less hackers know about your stack

const port=8080;



// HTTP GET Request

app.get('/',(req,res)=>{
    res.status(201).json("home get request")
})


app.listen(port,()=>{
    console.log(`Server connected to http://localhost:${port}`);

})