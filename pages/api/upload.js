import { IncomingForm } from 'formidable'
import { promises as fs } from 'fs'

var mv = require('mv');


export const config = {
    api: {
        bodyParser: false,
    }
};


// PUBLIC DİZİNİNE KAYDETMEK İÇİN

export default async function handle(req, res) {

    const data = await new Promise((resolve, reject) => {
        const form = new IncomingForm()

        form.parse(req, (err, fields, files) => {
            if (err) return reject(err)
            console.log(fields, files)
            console.log(files.file.filepath)
            var oldPath = files.file.filepath;
            var newPath = `./public/uploads/${files.file.originalFilename}`;
            mv(oldPath, newPath, function(err) {
            });
            res.status(200).json({ fields, files })
        })
    })

    return data

}



// import multiparty from 'multiparty';
// import {mongooseConnect} from "@/lib/mongoose";
// // import {PutObjectCommand, S3Client} from '@aws-sdk/client-s3';
// // import fs from 'fs';
// // import mime from 'mime-types';
// // import {isAdminRequest} from "@/pages/api/auth/[...nextauth]";
//
//
// // const bucketName = 'dawid-next-ecommerce';
//
// export default async function handle(req,res) {
//     await mongooseConnect();
//     // await isAdminRequest(req,res);
//
//     const form = new multiparty.Form();
//     const {fields,files} = await new Promise((resolve,reject) => {
//         form.parse(req, (err, fields, files) => {
//             if (err) reject(err);
//             resolve({fields,files});
//         });
//     });
//     console.log('length:', files.file.length);
//
//     for (const file of files) {
//         file.save('public/images')
//     }
//
//     // const client = new S3Client({
//     //     region: 'us-east-1',
//     //     credentials: {
//     //         accessKeyId: process.env.S3_ACCESS_KEY,
//     //         secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
//     //     },
//     // });
//     // const links = [];
//     // for (const file of files.file) {
//     //     const ext = file.originalFilename.split('.').pop();
//     //     const newFilename = Date.now() + '.' + ext;
//     //     await client.send(new PutObjectCommand({
//     //         Bucket: bucketName,
//     //         Key: newFilename,
//     //         Body: fs.readFileSync(file.path),
//     //         ACL: 'public-read',
//     //         ContentType: mime.lookup(file.path),
//     //     }));
//     //     const link = `https://${bucketName}.s3.amazonaws.com/${newFilename}`;
//     //     links.push(link);
//     // }
//     // return res.json({links});
// }
//
// export const config = {
//     api: {bodyParser: false},
// };



