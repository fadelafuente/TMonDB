from django.core.exceptions import ValidationError
from django.utils.deconstruct import deconstructible

@deconstructible
class MaxLengthValidator:
    max_length = 512
    message = 'Value exceeds max character length. Enter a valid value.'
    code = 'invalid'

    def __init__(self, max_length=None, message=None, code=None):
        if max_length:
            self.max_length = max_length
        if message:
            self.message = message
        if code:
            self.code = code

    def __call__(self, value):
        '''
        Validate that the length of the input is less than a max value.
        '''

        if len(value) > self.max_length:
            raise ValidationError(self.message, code=self.code, params={'value': value})
        
    def __eq__(self, other):
        return (
            isinstance(other, MaxLengthValidator)
            and self.max_length == other.max_length
            and self.message == other.message
            and self.code == other.code
        )
