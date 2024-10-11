# Homework task for NestJS Masterclass

## Table of Contents

- [Homework task for NestJS Masterclass](#homework-task-for-nestjs-masterclass)
  - [Table of Contents](#table-of-contents)
  - [Prerequisites](#prerequisites)
  - [Installation for Homework](#installation-for-homework)
  - [Homework Task](#homework-task)
    - [Description](#description)
    - [General Requirements for the Homework](#general-requirements-for-the-homework)
    - [Nice to have (Optional)](#nice-to-have-optional)
  - [How to Submit Your Homework](#how-to-submit-your-homework)
  - [Deadlines, Guidelines, and Late Submissions](#deadlines-guidelines-and-late-submissions)

## Prerequisites

- Node.js installed on your machine
- Git installed on your machine and a GitHub account
- Basic knowledge of branching and pull (merge) requests in Git and GitHub
- API client (Postman, Insomnia, Httpie, etc.) for testing the API endpoints

## Installation for Homework

1. Fork this repository using GitHub

2. Clone the forked repository to your local machine and navigate to the directory

    ```bash
    git clone <your-forked-repository-url>
    cd nestjs-masterclass
    ```

2. Create a new branch for your homework using your initials

    ```bash
    git checkout -b feat/<your-initials>/homework
    # Example: git checkout -b feat/ab/homework
    ```

3. Go to the `events-api` directory and install the dependencies

    ```bash
    cd events-api
    npm install
    ```

4. After installing the dependencies, start the server

    ```bash
    npm run start:dev
    ```

5. Go to the `payment-api` directory and install the dependencies

    ```bash
    cd ../payment-api
    npm install
    ```

6. After installing the dependencies, start the server

    ```bash
    npm run start
    ```

## Homework Task

### Description

In this homework task, you are required to continue building the REST API for the events application.

I've already created the following endpoints:

- `POST /auth/login`: Login endpoint for users
- `POST /auth/register`: Register endpoint for users
- `GET /events`: Get all events
- `GET /events/:id`: Get a single event by ID
- `POST /events`: Create a new event

An endpoint for creating a new event requires the user to be authenticated and have the role of `admin`.

You can use the following credentials to login as an admin:

- Email: `test-admin@test.com`
- Password: `test-admin@test.com`

You can use the following credentials to login as a user:

- Email: `test@test.com`
- Password: `test@test.com`


Now, you need to implement the following endpoints:

- Add a new endpoint to update an event by ID

    The route should be `PATCH /events/:id` and should only be accessible to authenticated users with the role of `admin`. It should update the event with the given ID. If the event does not exist, return a `400 Bad Request` response. It should return the updated event in the response.

    The request body should contain the following fields:

    - eventName
    - eventDescription
    - eventLocation
    - eventDate (in `YYYY-MM-DD HH:mm` format)

- Add a new endpoint to delete an event by ID

    The route should be `DELETE /events/:id` and should only be accessible to authenticated users with the role of `admin`. It should delete the event with the given ID. If the event does not exist, return a `400 Bad Request` response. It should return a deleted event in the response.

- Add a sort functionality to the `GET /events` endpoint

    The `GET /events` endpoint should accept a query parameter `sort_by` that can be `eventName`, `eventDate`, `eventCreatedAt`, or `eventUpdatedAt`. In addition, it should accept a query parameter `sort_order` that can be `asc` or `desc`. The endpoint should return the events sorted by the given field and order.

    Example request:

    ```http
    GET /events?sort_by=eventDate&sort_order=asc
    ```

    Example response:

    ```json
    {
        "events": [
            {
                "id": 1,
                "eventName": "Event 1",
                "eventDescription": "Description 1",
                "eventLocation": "Location 1",
                "eventDate": "2022-01-01T00:00:00.000Z",
                "eventCreatedAt": "2022-01-01T00:00:00.000Z",
                "eventUpdatedAt": "2022-01-01T00:00:00.000Z"
            },
            {
                "id": 2,
                "eventName": "Event 2",
                "eventDescription": "Description 2",
                "eventLocation": "Location 2",
                "eventDate": "2022-01-02T00:00:00.000Z",
                "eventCreatedAt": "2022-01-02T00:00:00.000Z",
                "eventUpdatedAt": "2022-01-02T00:00:00.000Z"
            }
        ]
    }
    ```

- Add a new table for tickets

    Using Prisma, create a new table for tickets. The table should have the following fields:

    - ticketId (auto-generated)
    - ticketQuantity (number of tickets)
    - ticketPrice (price of each ticket)
    - ticketStatus (status of the ticket, can be `pending`, `paid`, or `cancelled`)
    - ticketCreatedAt (timestamp)
    - ticketUpdatedAt (timestamp)
    - ticketTransactionId (transaction ID, UUID format)
    - ticketEventId (foreign key to the events table)
    - ticketUserId (foreign key to the users table)

- Add a new module for tickets

    Create a new module for tickets that contains the following endpoints:

    - `POST /tickets`: Create a new ticket for an event

        The route should be `POST /tickets` and should only be accessible to authenticated users. It should create a new ticket for the event with the given ID. If the event does not exist, return a `400 Bad Request` response. It should return the created ticket in the response.

        The request body should contain the following fields:

        - ticketQuantity
        - ticketPrice
        - ticketEventId

    - `GET /tickets`: Get all tickets of the authenticated user

        The route should be `GET /tickets` and should only be accessible to authenticated users. It should return all tickets of the authenticated user.

    - `GET /tickets/:id`: Get a single ticket by ID of the authenticated user

        The route should be `GET /tickets/:id` and should only be accessible to authenticated users. It should return the ticket with the given ID of the authenticated user. If the ticket does not exist or does not belong to the authenticated user, return a `400 Bad Request` response.

    - `PUT /tickets/:id/pay`: Pay for a ticket

        The route should be `PUT /tickets/:id/pay` and should only be accessible to authenticated users. It should update the status of the ticket with the given ID to `paid`. If the ticket does not exist or does not belong to the authenticated user, return a `400 Bad Request` response.

        It accepts the following request body:

        - last4Digits (last 4 digits of the credit card)
        - cardExpiry (expiry date of the credit card in `MM/YY` format)
        - cardHolderName (name of the card holder)
        - paymentToken (payment token, 22 characters long)
        - paymentAmount (total amount to be paid)

        All of the fields are required.

        When a ticket is paid, you should call the payment API to process the payment. The payment API is running on `http://localhost:<port>` where `<port>` is the port number of the payment API. You can specify the port number in the `.env` file in the `payment-api` directory.

        The payment API has the following endpoint:

        - `POST /payment` with the following request body:

            ```json
            {
                "last4": "Last 4 digits of the credit card",
                "expiration": "Expiry date of the credit card",
                "cardholder": "Name of the card holder",
                "amount": "Total amount to be paid",
                "paymentToken": "Payment token"
            }
            ```

            If the payment is successful, the Payment API will return a `200 OK` response with the following body:

            ```json
            {
                "message": "Payment successful",
                "transactionId": "Transaction ID (UUID)"
            }
            ```

            If the payment fails, the Payment API will return a `400 Bad Request` response with the following body:

            ```json
            {
                "message": "Payment failed",
                "transactionId": "Transaction ID (UUID)",
                "error": "Object containing the error details"
            }
            ```

            For testing purposes, for payment token, you can put any 22 characters long string. The same goes for the expiry date, amount, and cardholder name.

            If you want to get a successful payment response, you should use `4242` as the last 4 digits of the credit card. For an unsuccessful payment response, you can use any other number.

            To handle the payment feature, you should create a new module in the `events-api` that will handle the payment logic and call the payment API. You should use `HttpModule` and `HttpService` to make HTTP requests to the payment API.

            The payment API requires a special `Authorization` header token to be passed in the request.

            You can specify the token in the `.env` file in the `payment-api` directory: `ACCESS_TOKEN=<token>`. You should use this token to send requests to the payment API from the `events-api`.

            It should be stored in the `.env` file in the `events-api` directory as well and used by the `HttpService` to make requests to the payment API in the Payments module.

    - `PUT /tickets/:id/cancel`: Cancel a ticket

        The route should be `PUT /tickets/:id/cancel` and should only be accessible to authenticated users. It should update the status of the ticket with the given ID to `cancelled`. If the ticket does not exist or does not belong to the authenticated user, return a `400 Bad Request` response.

### General Requirements for the Homework

- A new table should be created for tickets using Prisma and it should have the migration file
- A new module should be created for tickets that contain the endpoints mentioned above
- A new module should be created for payments that will handle the calls to the payment API
- Everything should be validated using the appropriate decorators and pipes (class-validator, class-transformer, built-in pipes and custom validators and pipes)
- The code should be properly formatted and linted

### Nice to have (Optional)

- Add unit tests for the new services and functions using Jest. More here: https://docs.nestjs.com/fundamentals/testing
- Add Helmet middleware to secure the application. More here: https://docs.nestjs.com/security/helmet
- Add Swagger documentation for the API. More here: https://docs.nestjs.com/openapi/introduction

## How to Submit Your Homework

Submission of the homework should be done via a pull request to the original repository.

1. In the PR, as a title use following format: `[<Your Initials>] Homework Submission`. For example: `[AB] Homework Submission`

2. In the PR description, using checkboxes, list the tasks you have completed:

    - [ ] Added a new endpoint to update an event by ID
    - [ ] Added a new endpoint to delete an event by ID
    - [ ] Added a sort functionality to the `GET /events` endpoint
    - [ ] Added a new table for tickets
    - [ ] Added a new endpoint to create a new ticket for an event
    - [ ] Added a new endpoint to pay for a ticket with the payment API
    - [ ] Added a new endpoint to cancel a ticket
    - [ ] Added a new endpoint to get all tickets of the user
    - [ ] Added a new endpoint to get a single ticket by ID of the user

    Attach the screenshots of the API endpoints you have implemented.

3. Assign the PR to me for review

4. Wait for the review and feedback

## Deadlines, Guidelines, and Late Submissions

- The deadline for submitting your homework is 23:59, Friday, 18th October 2024.
- Late submissions will not be accepted.
- If you are unable to complete the homework by the deadline, please let me know as soon as possible.
- The homework would be marked as submitted if you have created a pull request before the deadline. If you don't create a pull request, your homework will be considered as not submitted.
- If you have any questions or need help with the homework, please reach out to me on Microsoft Teams or personally.
- You can use any resources available to you to complete the homework, even AI (ChatGPT, etc.). You can try to cheat and just copy-paste the code from what GitHub Copilot or ChatGPT suggests, but you will not learn anything from it. I encourage you to try to solve the homework on your own, try not to use any AI tools, read the documentation, and ask for help from the groupmates or me if you need it. It's okay to ask for help, but it's not okay to cheat.

Good luck with your homework! 🚀
