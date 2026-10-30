const path=require('path');
require('dotenv').config({path:path.resolve(process.env.HOME,'app1/backend/.env')});

const app=require('./app');
const db=require('./config/db');

const PORT=process.env.PORT || 3000;

async function startServer(){
    try{
        await db.connect();
        console.log('Database connected successfully');
    }catch(err){
        console.error('Database connection failed:',err.message);
        process.exit(1);
    }
} 
app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
    startServer();
}); 

 

