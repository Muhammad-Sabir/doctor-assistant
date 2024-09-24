from rest_framework.validators import ValidationError


class FileUploadMixin:
    def handle_file_upload(self, instance, file):
        if not file:
            return
        try:
            instance.save_file(file)
            instance.save()
        except ValidationError as e:
            raise e
 