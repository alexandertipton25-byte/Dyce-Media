const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'..'),dir=path.join(root,'.model-parts');
const files=fs.readdirSync(dir).filter(n=>/^island-\d{3}$/.test(n)).sort();
const data=Buffer.concat(files.map(n=>fs.readFileSync(path.join(dir,n))));
if(crypto.createHash('sha256').update(data).digest('hex')!=='5a20a8420797f3aa56630ce1d91a82a3b2eb25fc06ecd9d9a22f90995e3acc27')throw Error('Original island checksum mismatch');
fs.mkdirSync(path.join(root,'assets/models'),{recursive:true});
fs.writeFileSync(path.join(root,'assets/models/floating-island.glb'),data);
console.log('Original island assembled and SHA-256 verified: '+data.length+' bytes');
