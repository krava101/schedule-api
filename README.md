# Schedule API

- ## Authentication

  - ### Registration

    **POST /api/auth/register**
    Content-Type: application/json
    Request Body:{
    "name": "example",
    "email": "example@gmail.com",
    "password": "example"
    }

    **Success response**
    Status: 201 Created
    Response Body: { "message": "We sent a mail for verification on ${email}" }

    **Validation error**
    Status: 400 Bad Request
    Response Body: { "message": (Validation error)}

    **Registration conflict error**
    Status: 409 Conflict
    Response Body: { "message": "User already registrered"}

  - ### Verification user by email

    **POST /api/auth/verify**
    Content-Type: application/json
    Request Body: {
    "code": "example"
    }

    **Success response**
    Status: 200 OK
    Response Body: { "message": "Verification successful!" }

    **Validation error**
    Status: 400 Bad Request
    Response Body: { "message": (Validation error)}

    **Verification user Not Found**
    Status: 404 Not Found
    Response Body: { "message": "User not found!" }

  - ### Resend code for verification

    **POST /api/auth/resend**
    Content-Type: application/json
    Request Body:{
    "email":"example@gmail.com"
    }

    **Success response**
    Status: 200 OK
    Response Body: { "message": "We resend a mail for verification on ${email}" }

    **Validation error**
    Status: 400 Bad Request
    Response Body: { "message": (Validation error)}

    **Verification user Not Found**
    Status: 404 Not Found
    Response Body: { "message": "User not found!" }

    **Verified user error**
    Status: 400 Bad Request
    Response Body: { "message": "Verification has already been passed!" }

  - ### Login

    **POST /api/auth/login**
    Content-Type: application/json
    Request Body:{
    "email": "example@gmail.com",
    "password": "example"
    }

    **Success response**
    Status: 200 OK
    Response Body: {
    "token": "exampleTOKEN",
    "user": {
    "id": "exampleID",
    "name": "example",
    "email": "example@gmail.com",
    }}

    **Validation error**
    Status: 400 Bad Request
    Response Body: { "message": (Validation error)}

    **Login auth error**
    Status: 401 Unauthorized
    Response Body: {
    "message": "Email or password is wrong!"
    }

    **Not verified**
    Status: 403 Forbidden
    Response Body: {
    "message": "Account is not verified!"
    }

  - ### Logout

    **POST api/auth/logout**
    Headers Authorization: "Bearer {{TOKEN}}"

    **Success response**
    Status: 204 No Content

    **Invalid token error**
    Status: 401 Unauthorized
    Response Body: { "message": "Invalid token!" }
