FROM python:3.9

RUN mkdir back

WORKDIR back

COPY . .

# ADD USERNAME TO RUN COMMANDS A SUBuSER

RUN python -m venv env

RUN pip install -r requirements.txt

RUN /bin/bash -c "source env/bin/activate"

# && python manage.py makemigrations && python manage.py migrate"

# RUN chmod 777 MIGRATIONS_MAKER.sh && ./MIGRATIONS_MAKER.sh

ENTRYPOINT ["python", "manage.py" , "runserver", "0.0.0.0:8000"]

