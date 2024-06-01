# schedule-api

## API

- ## Authentication

  - ### Registration

    POST /api/auth/register
    req.body:
    {
    name,
    email,
    password
    }

    response: { "message": "We sent a mail for verification on ${email}" }

  - ### Verification user by email

    POST /api/auth/verify
    req.body:
    {
    code > Verify CODE from email
    }

    response: { "message": "Verification successful!" }

  - ### Resend code for verification

    POST /api/auth/resend < Resend verify code
    req.body:
    {
    email
    }

    response: { "message": "We resend a mail for verification on ${email}" }

  - ### Login

    POST /api/auth/login
    req.body:
    {
    email,
    password
    }

    response:
    {
    "token": TOKEN > Authorization Bearer Token,
    "user": {
    "id",
    "name",
    "email",
    }
    }

  - ### Logout
    POST api/auth/logout
    Headers Authorization: Bearer TOKEN
