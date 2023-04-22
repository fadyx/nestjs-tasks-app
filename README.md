## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ yarn install
```

## Setup
```bash
yarn db:dev:up
```

Then copy the contents of `.env.example` file to new `.env` file in the root directory of the project.

## Running the app

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

```

## Notes

- The app should be available on http://localhost:3000
- Swagger documentation on http://localhost:3000/api
- You can import Postman collection `NestJS.postman_collection.json` file for all the available requests (includes environment variables setup through scripts, for example when you register new user, the proper tokens are set up).
- The logger middleware can be found in `/src/utils/middleware/logging.middleware.ts`
- The interceptor can be found in `/src/utils/interceptors/duration.interceptor.ts`

## DB optimization
- Create composite index on Tasks("userId", "isComplete") for faster selection of tasks by userId lookup, and optionally query isComplete.
- Performance of pagination with offset and limit may decrease when the table and specified offset increase in numbers. An alternative solution would be using keyset pagination, use the id of a task to create pagination, this will help the database to drop the overhead of sorting and dropping the offset number of columns.