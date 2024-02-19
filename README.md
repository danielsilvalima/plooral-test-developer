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

### Bonus Questions

An alternative for system scalability would be to use cron (Linux) to execute a JS file.
This JS file is responsible for reading the SQS queue, processing the message to see if the ad contains harmful content, and then sending it to S3 (Feed endpoint).
Another alternative would be to create your own routine to check whether the content is harmful or not, this way, you would not need to pay for the OPENAI API and you would not need to worry about the response time of the third-party moderation API.
