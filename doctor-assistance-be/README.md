# Doctor assistance

## Run Application

First replace the .env.template with .env and fill its fields and make sure, you have already created the database, which you provided in .env.

### Make Sure, You are inside the Doctor-Assistance-be

1.  Install all the packages through: `pip install -r requirements.txt`
2.  Run the followings command:
    - `python manage.py makemigrations`
    - `python manage.py migrate`
3.  To Run the server:
    - `python manage.py runserver`
