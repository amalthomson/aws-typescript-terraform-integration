"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
const s3Client = new client_s3_1.S3Client({});
const handler = (event, context, callback) => __awaiter(void 0, void 0, void 0, function* () {
    const bucketName = 'api-sqs-lambda-ssm-s3-integration';
    const objectName = 'data.json';
    try {
        const command = new client_s3_1.GetObjectCommand({
            Bucket: bucketName,
            Key: objectName
        });
        const response = yield s3Client.send(command);
        if (response.Body) {
            const bodyContents = yield response.Body.transformToString();
            const jsonData = JSON.parse(bodyContents);
            console.log('Fetched data from S3:', JSON.stringify(jsonData, null, 2));
        }
    }
    catch (error) {
        console.error('Error fetching data from S3:', error);
    }
    for (const record of event.Records) {
        try {
            const messageBody = JSON.parse(record.body);
            const { firstname, lastname } = messageBody;
            const country = process.env.country || 'Unknown';
            console.log(`Hello ${firstname} ${lastname}`);
            console.log(`Thank you for reaching out, your request is under process.`);
            console.log(`Please select a Country of choice from "${country}"`);
            console.log(`Regards`);
        }
        catch (error) {
            console.error('Error processing message:', error);
            console.log('Original message body:', record.body);
        }
    }
});
exports.handler = handler;
