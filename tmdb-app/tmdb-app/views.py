from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework_simplejwt import views
from djoser.social import views as social_views

def _post(response):
        # if the response did not return an access token, returns response
        if "access" not in response.data:
            return response
        
        # split access token into two parts, header.payload, and signature.
        access = response.data["access"]
        access, signature = access.rsplit(".", 1)
        data = {"access": access}

        # create a new response without the refresh token and with the signature as a cookie.
        new_response = Response(data=data, status=response.status_code)
        new_response.set_cookie(key="signature", value=signature, httponly=True)
        
        return new_response

class CustomTokenCreateView(views.TokenObtainPairView):
    def post(self, request: Request, *args, **kwargs) -> Response:
        response = super().post(request, *args, **kwargs)
        return _post(response)
    
class CustomTokenVerifyView(views.TokenVerifyView):
    def post(self, request: Request, *args, **kwargs) -> Response:
        token = request.data["token"]
        if token is None:
            raise KeyError("No access token provided.")

        # check if signature is in cookies before appending to token
        signature = request.COOKIES.get("signature")
        if signature is None:
            raise KeyError("No signature provided.")

        # update token and send post request
        token += "." + signature
        request.data["token"] = token
        return super().post(request, *args, **kwargs)
    

class CustomProviderAuthView(social_views.ProviderAuthView):
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        return _post(response)