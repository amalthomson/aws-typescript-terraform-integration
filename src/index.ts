import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { SQSEvent, Context, Callback } from 'aws-lambda';

const s3Client = new S3Client({});

interface MessageBody {
  firstname: string;
  lastname: string;
}

export const handler = async (event: SQSEvent, context: Context, callback: Callback): Promise<void> => {
  const bucketName = 'api-sqs-lambda-ssm-s3-integration';
  const objectName = 'data.json';

  try {
    const command = new GetObjectCommand({
      Bucket: bucketName,
      Key: objectName
    });
    const response = await s3Client.send(command);
    
    if (response.Body) {
      const bodyContents = await response.Body.transformToString();
      const jsonData = JSON.parse(bodyContents);
      console.log('Fetched data from S3:', JSON.stringify(jsonData, null, 2));
    }
  } catch (error) {
    console.error('Error fetching data from S3:', error);
  }

  for (const record of event.Records) {
    try {
      const messageBody: MessageBody = JSON.parse(record.body);
      const { firstname, lastname } = messageBody;
      const country = process.env.country || 'Unknown';

      console.log(`Hello ${firstname} ${lastname}`);
      console.log(`Thank you for reaching out, your request is under process.`);
      console.log(`Please select a Country of choice from "${country}"`);
      console.log(`Regards`);
    } catch (error) {
      console.error('Error processing message:', error);
      console.log('Original message body:', record.body);
    }
  }
};