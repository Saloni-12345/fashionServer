let express = require("express");
let fs = require("fs");
let fname = "fash.json";
let fashionData = require("./myFashionData.js");
let app = express();
app.use(express.json());
app.use(function(req,res,next){
res.header("Access-Control-Allow-Origin","*");
res.header("Access-Control-Allow-Methods",
"GET,POST,PUT,HEAD,DELETE,PATCH,OPTIONS");
res.header("Access-Control-Allow-Headers",
"Origin,X-Requested-With,Content-Type,Accept");
next();
});
let port = process.env.PORT||2410;
app.listen(port,()=> console.log(`Node app listening on port ${port}!`));

app.get("/resetData",async function(req,res){
 let str = JSON.stringify(fashionData);
 try{
 await fs.promises.writeFile(fname,str);
 res.send("Data Reset Successfully");
 }catch(error){
   if(error.response){
    let {status,statusText} = error.response;
    res.status(status).send(statusText);
   }else res.status(404).send(error);
 }
})
app.get("/products",async function(req,res){
let category = req.query.category;
 try{
    let response = await fs.promises.readFile(fname,"utf-8");
    let itemData = JSON.parse(response);
    if(!category) res.send(itemData.items);
    else{
        let item = itemData.items.filter((itm)=>itm.category===category);
        res.send(item);
    }
 }catch(error){
    if(error.response){
        let {status,statusText} = error.response;
        res.status(status).send(statusText);
       }else res.status(404).send(error); 
 }
})
app.get("/products/:id",async function(req,res){
let id = req.params.id;
try{
    let response = await fs.promises.readFile(fname,"utf-8");
    let itemData = JSON.parse(response);
    let item = itemData.items.find((itm)=>itm.id===+id);
     if(!item) res.status(401).send("No items found");
    else res.send(item); 
}catch(error){
    if(error.response){
        let {status,statusText} = error.response;
        res.status(status).send(statusText);
       }else res.status(404).send(error); 
 }
})
app.post("/products",async function(req,res){
let body = req.body;
try{
 let response = await fs.promises.readFile(fname,"utf-8");
 let itemData = JSON.parse(response);
 let maxid = itemData.items.reduce((acc,curr)=>acc<curr.id?curr.id:acc,0);
 let newid = maxid+1
 let newItem = {id:newid,...body}
 itemData.items.push(newItem);
 let str = JSON.stringify(itemData);
 await fs.promises.writeFile(fname,str);
 res.send(newItem);
}catch(error){
    if(error.response){
        let {status,statusText} = error.response;
        res.status(status).send(statusText);
       }else res.status(404).send(error); 
 }
})
app.put("/products/:id",async function(req,res){
let id = req.params.id;
let body = req.body;
try{
   let response = await fs.promises.readFile(fname,"utf-8");
   let itemData = JSON.parse(response);
   let index = itemData.items.findIndex((itm)=>itm.id===+id);
   if(index>=0) 
   {
    let updateItem = {...itemData.items[index],...body};
    itemData.items[index] = updateItem;
    let str = JSON.stringify(itemData);
    await fs.promises.writeFile(fname,str);
    res.send(updateItem);
   }else res.status(404).send("No item found");
}catch(error){
    if(error.response){
        let {status,statusText} = error.response;
        res.status(status).send(statusText);
       }else res.status(404).send(error); 
}
})
app.delete("/products/:id",async function(req,res){
let id = req.params.id;
try{
let response = await fs.promises.readFile(fname,"utf-8");
let itemData = JSON.parse(response);
let index = itemData.items.findIndex((itm)=>itm.id===+id);
if(index>=0){
 itemData.items.splice(index,1);
 let str = JSON.stringify(itemData);
 await fs.promises.writeFile(fname,str);
 res.send("1 Item Deleted Successfully");
}else res.status(404).send("No item found");

}catch(error){
    if(error.response){
        let {status,statusText} = error.response;
        res.status(status).send(statusText);
       }else res.status(404).send(error); 
}
})
app.get("/orders",async function(req,res){
    try{
       let response = await fs.promises.readFile(fname,"utf-8");
       let itemData = JSON.parse(response);
       res.send(itemData.orders);
    }catch(error){
       if(error.response){
           let {status,statusText} = error.response;
           res.status(status).send(statusText);
          }else res.status(404).send(error); 
    }
})
app.post("/orders",async function(req,res){
  let body = req.body;
try{
  let response = await fs.promises.readFile(fname,"utf-8");
  let itemData = JSON.parse(response);
  let maxid = itemData.orders.reduce((acc,curr)=>acc<curr.orderId?curr.orderId:acc,0);
  let newid = maxid+1;
  let newOrder = {orderId:newid,...body}
  itemData.orders.push(newOrder);
  let str = JSON.stringify(itemData);
  await fs.promises.writeFile(fname,str);
  res.send(newOrder);
}catch(error){
  if(error.response){
    let {status,statusText} = error.response;
     res.status(status).send(statusText);
     }else res.status(404).send(error); 
  }   
})
app.post("/login",async function(req,res){
 let body = req.body;
 try{
   let response = await fs.promises.readFile(fname,"utf-8");
   let itemData = JSON.parse(response);
   let login = itemData.loginData.find((log)=>log.email===body.email && log.password===body.password);
   if(!login) res.status(404).send("Invalid login Credentials");
   else res.json({
     email:login.email,
     role:login.role,
   })
 }catch(error){
    if(error.response){
      let {status,statusText} = error.response;
       res.status(status).send(statusText);
       }else res.status(404).send(error); 
    }
})
app.post("/register",async function(req,res){
 let body = req.body;
try{
      let response = await fs.promises.readFile(fname,"utf-8");
      let itemData = JSON.parse(response);
      itemData.loginData.push({...body,role:"user"});
    let str = JSON.stringify(itemData);
    await fs.promises.writeFile(fname,str);
      res.send("Register Successfully")
    }catch(error){
       if(error.response){
         let {status,statusText} = error.response;
          res.status(status).send(statusText);
          }else res.status(404).send(error); 
       }
})