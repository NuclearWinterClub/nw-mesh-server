const https = require('https');
const data = JSON.stringify({key:'nw_mesh_2025',command:'!oasis'});
const req = https.request({
  hostname:'chemicals-providers-paxil-swimming.trycloudflare.com',
  path:'/trigger',
  method:'POST',
  headers:{'Content-Type':'application/json','Content-Length':data.length}
},res=>{
  let body='';
  res.on('data',d=>body+=d);
  res.on('end',()=>console.log(body));
});
req.write(data);
req.end();
