from fastapi import HTTPException, status

class UsernameAlreadyExists(HTTPException):

    def __init__(self):
        super().__init__(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already exists!"
        )

class InvalidCredentials(HTTPException):

    def __init__(self):
        super().__init__(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"}
        )

class UnauthorizedError(HTTPException):

    def __init__(self):
        super().__init__(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User is not authorized!",
            headers={"WWW-Authenticate": "Bearer"}
        )