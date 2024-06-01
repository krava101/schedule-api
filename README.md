# schedule-api

## API

- Authentication

  - POST /api/auth/register
    req.body:
    {
    name,
    email,
    password
    }

    response: { "message": "We sent a mail for verification on ${email}" }

  - POST /api/auth/verify
    req.body:
    {
    code > Verify CODE from mail
    }

    response: { "message": "Verification successful!" }

  - POST /api/auth/resend < Resend verify code
    req.body:
    {
    email
    }

    response: { "message": "We resend a mail for verification on ${email}" }

  - POST /api/auth/login
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

  - POST api/auth/logout
    Headers Authorization: Bearer TOKEN
