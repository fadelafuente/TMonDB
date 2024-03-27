from typing import Optional, Tuple
from rest_framework.request import Request
from rest_framework_simplejwt.authentication import JWTAuthentication, AuthUser
from rest_framework_simplejwt.tokens import Token
from django.conf import settings

class CustomJWTAuthentication(JWTAuthentication):
    def authenticate(self, request: Request) -> Optional[Tuple[AuthUser, Token]]:
        header = self.get_header(request)
        if header is None:
            return None
        
        signature = request.COOKIES.get("signature")
        if signature is None:
            return None

        raw_token = self.get_raw_token(header)
        if raw_token is None:
            return None
        
        raw_token = raw_token.decode("utf-8") + "." + signature
        raw_token = raw_token.encode()

        validated_token = self.get_validated_token(raw_token)

        return self.get_user(validated_token), validated_token