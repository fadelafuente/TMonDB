from typing import Optional, Tuple
from rest_framework.request import Request
from rest_framework_simplejwt.authentication import JWTAuthentication, AuthUser
from rest_framework_simplejwt.tokens import Token

class CustomJWTAuthentication(JWTAuthentication):
    def authenticate(self, request: Request) -> Optional[Tuple[AuthUser, Token]]:
        header = self.get_header(request)
        signature = request.COOKIES.get("signature")
        if header is None:
            return None
        if signature is None:
            return None

        raw_token = self.get_raw_token(header).decode("utf-8")
        raw_token += "." + signature
        raw_token = raw_token.encode()
        if raw_token is None:
            return None

        validated_token = self.get_validated_token(raw_token)

        return self.get_user(validated_token), validated_token