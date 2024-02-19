# Backend Developer Technical Assessment

## Settings!

1. **REST API**: NodeJS (version 20) and ExpressJS.

2. **Serverless Environment**: AWS Lambda and AWS SQS for queue management.

3. **Database**: SQL database (PostgreSQL 16).

### User Actions

- `GET /companies`: List existing companies.
- `GET /companies/:company_id`: Fetch a specific company by ID.
- `POST /job`: Create a job posting draft.
- `PUT /job/:job_id/publish`: Publish a job posting draft.
- `PUT /job/:job_id`: Edit a job posting draft (title, location, description).
- `DELETE /job/:job_id`: Delete a job posting draft.
- `PUT /job/:job_id/archive`: Archive an active job posting.

### Extra Feature

- **Job Moderation**: using artificial intelligence, we need to moderate the job content before allowing it to be published, to check for potential harmful content.
Every time a user requests a job publication (`PUT /job/:job_id/publish`), the API should reply with success to the user, but the job should not be immediately published. It should be queued using AWS SQS, feeding the job to a Lambda component.
Using OpenAI's free moderation API, create a Lambda component that will evaluate the job title and description, and test for hamrful content. If the content passes the evaluation, the component should change the job status to `published`, otherwise change to `rejected` and add the response from OpenAI API to the `notes` column.

### Bonus Questions

An alternative for system scalability would be to use cron (Linux) to execute a JS file.
This JS file is responsible for reading the SQS queue, processing the message to see if the ad contains harmful content, and then sending it to S3 (Feed endpoint).
Another alternative would be to create your own routine to check whether the content is harmful or not, this way, you would not need to pay for the OPENAI API and you would not need to worry about the response time of the third-party moderation API.
