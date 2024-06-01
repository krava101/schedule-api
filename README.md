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

    _Success response_
    Status: 201 Created
    Response Body: { "message": "We sent a mail for verification on ${email}" }

    _Validation error_
    Status: 400 Bad Request
    Response Body: { "message": (Validation error)}

    _Registration conflict error_
    Status: 409 Conflict
    Response Body: { "message": "User already registrered"}

  - ### Verification user by email

    **POST /api/auth/verify**
    Content-Type: application/json
    Request Body: {
    "code": "example"
    }

    _Success response_
    Status: 200 OK
    Response Body: { "message": "Verification successful!" }

    _Validation error_
    Status: 400 Bad Request
    Response Body: { "message": (Validation error)}

    _Verification user Not Found_
    Status: 404 Not Found
    Response Body: { "message": "User not found!" }

  - ### Resend code for verification

    **POST /api/auth/resend**
    Content-Type: application/json
    Request Body:{
    "email":"example@gmail.com"
    }

    _Success response_
    Status: 200 OK
    Response Body: { "message": "We resend a mail for verification on ${email}" }

    _Validation error_
    Status: 400 Bad Request
    Response Body: { "message": (Validation error)}

    _Verification user Not Found_
    Status: 404 Not Found
    Response Body: { "message": "User not found!" }

    _Verified user error_
    Status: 400 Bad Request
    Response Body: { "message": "Verification has already been passed!" }

  - ### Login

    **POST /api/auth/login**
    Content-Type: application/json
    Request Body:{
    "email": "example@gmail.com",
    "password": "example"
    }

    _Success response_
    Status: 200 OK
    Response Body: {
    "token": "exampleTOKEN",
    "user": {
    "id": "exampleID",
    "name": "example",
    "email": "example@gmail.com",
    }}

    _Validation error_
    Status: 400 Bad Request
    Response Body: { "message": (Validation error)}

    _Login auth error_
    Status: 401 Unauthorized
    Response Body: {
    "message": "Email or password is wrong!"
    }

    _Not verified_
    Status: 403 Forbidden
    Response Body: {
    "message": "Account is not verified!"
    }

  - ### Logout

    **POST api/auth/logout**
    Headers Authorization: "Bearer {{TOKEN}}"

    _Success response_
    Status: 204 No Content

    _Invalid token error_
    Status: 401 Unauthorized
    Response Body: { "message": "Invalid token!" }
