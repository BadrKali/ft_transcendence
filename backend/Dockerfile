FROM python:3.9

# prevents python buffering stdout and stderr
ENV PYTHONUNBUFFERED 1

# prevents python from writing .pyc files to disc
ENV PYTHONDONTWRITEBYTECODE 1

WORKDIR back

COPY . .

# ADD USERNAME TO RUN COMMANDS A SUBuSER

RUN python -m venv env

RUN pip install -r requirements.txt