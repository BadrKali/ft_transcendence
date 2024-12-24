# ft_transcendence

- Ft-transcendence is a full-stack application combining a web-based platform provoding a set of features for users to play a Ping Pong games, chat, and interact with each other in real-time.
- The application is built with separate services for the frontend, backend, database, cache, and reverse proxy.
- The infrastructure is managed using Docker and Docker Compose, with additional components for monitoring and logging.

![](https://github.com/AhmedFatir/AhmedFatir/blob/master/images/%20Transcendence.png)


## Features
- **[Signup and Login]()**: Users can create an account and log in to the application or use third-party authentication with 42 OAuth2.
- **[Profile Management]()**: Users can view and edit their profile information.
- **[Friend Management]()**: Users can send, accept, and reject friend requests.
- **[Real-time Chat]()**: Users can chat with their friends in real-time.
- **[Game Rooms]()**: Users can create and join game rooms to play games with their friends.
- **[Gameplay]()**: Users can play games against each other in real-time.
- **[Leaderboard]()**: Users can view the leaderboard to see the top players.
- **[Tournaments]()**: Users can participate in tournaments and compete against each other.
- **[Notifications]()**: Users receive notifications for friend requests, chat messages, game invites, and tournament games.
- **[Security]()**: The application is secured using authentication, authorization, and encryption: (JWT tokens, OAuth2, 2FA, SSL/TLS).
- **[Monitoring]()**: The application is monitored using Prometheus and Grafana for metrics and alerting.
- **[Logging]()**: The application logs are collected and processed using the ELK stack (Elasticsearch, Logstash, Kibana).

---
## Project Structure
### Management
 <a href="https://www.docker.com/" target="_blank" rel="noreferrer"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/docker/docker-original-wordmark.svg" alt="docker" width="40" height="40"/> </a>
 <a href="https://yaml.org/" target="_blank" rel="noreferrer"> <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/yaml/yaml-original.svg" alt="yaml" width="40" height="40"/> </a>
 <a href="https://makefiletutorial.com/" target="_blank" rel="noreferrer"> <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/cmake/cmake-original.svg" alt="yaml" width="40" height="40"/> </a>

- **Docker**: Manages application containers for each service.
- **Docker Compose**: Manages the application infrastructure using Docker containers.
- **Makefile**: Provides shortcuts for common tasks.
### Web Application Architecture
#### 1. **Frontend**
<a href="https://www.javascript.com/" target="_blank" rel="noreferrer"> <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg" alt="bash" width="40" height="40"/> </a>
<a href="https://nodejs.org/en" target="_blank" rel="noreferrer"> <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-original-wordmark.svg" alt="bash" width="40" height="40"/> </a>
<a href="https://react.dev/" target="_blank" rel="noreferrer"> <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original-wordmark.svg" alt="bash" width="40" height="40"/> </a>
<a href="https://www.npmjs.com/" target="_blank" rel="noreferrer"> <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/npm/npm-original-wordmark.svg" alt="bash" width="40" height="40"/> </a>
<a href="https://webpack.js.org/" target="_blank" rel="noreferrer"> <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/webpack/webpack-original-wordmark.svg" alt="bash" width="40" height="40"/> </a>

- **Technology**: JavaScript, Node.js, ReactJS, NPM, Webpack
- **Port**: 3000
- **Purpose**: The frontend is responsible for rendering the user interface and interacting with the backend through APIs.

#### 2. **Backend**
 <a href="https://www.python.org/" target="_blank" rel="noreferrer"> <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg" alt="yaml" width="40" height="40"/> </a>
 <a href="https://www.django-rest-framework.org/" target="_blank" rel="noreferrer"> <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/django/django-plain-wordmark.svg" alt="yaml" width="40" height="40"/> </a>
 <a href="https://www.djangoproject.com/" target="_blank" rel="noreferrer"> <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/djangorest/djangorest-original.svg" alt="yaml" width="40" height="40"/> </a>
 <a href="https://oauth.net/2/" target="_blank" rel="noreferrer"> <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/oauth/oauth-original.svg" alt="yaml" width="40" height="40"/> </a>
- **Technology**: Python, Django, Django REST framework, OAuth2, JWT
- **Port**: 8000
- **Purpose**: The backend handles business logic, processes API requests, and interacts with the database and caching layers.

#### 3. **Database**
<a href="https://www.postgresql.org/" target="_blank" rel="noreferrer"> <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/postgresql/postgresql-original-wordmark.svg" alt="bash" width="40" height="40"/> </a>

- **Technology**: PostgreSQL
- **Port**: 5432
- **Purpose**: Stores application data, including user information and application state.

#### 4. **Cache**
<a href="https://redis.io/" target="_blank" rel="noreferrer"> <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/redis/redis-original-wordmark.svg" alt="bash" width="40" height="40"/> </a>

- **Technology**: Redis
- **Port**: 6379
- **Purpose**: Provides caching to enhance application performance by reducing database queries.

#### 5. **Reverse Proxy**
<a href="https://nginx.org/en/" target="_blank" rel="noreferrer"> <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nginx/nginx-original.svg" alt="bash" width="40" height="40"/> </a>

- **Technology**: NGINX
- **Ports**: 443 (HTTPS), 80 (HTTP)
- **Purpose**: Acts as a reverse proxy to manage requests between users and the frontend/backend services. It also handles SSL termination.

#### 6. **Logs**
- **File**: `access.log`
- **Purpose**: Maintains access logs for monitoring and debugging.

---

### DevOps Infrastructure
#### 1. **[Log Management System](https://github.com/AhmedFatir/ELK-Stack)**
<a href="https://www.elastic.co/elasticsearch" target="_blank" rel="noreferrer"> <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/elasticsearch/elasticsearch-original.svg" alt="bash" width="40" height="40"/> </a>
<a href="https://www.elastic.co/logstash" target="_blank" rel="noreferrer"> <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/logstash/logstash-original.svg" alt="bash" width="40" height="40"/> </a>
<a href="https://www.elastic.co/kibana" target="_blank" rel="noreferrer"> <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/kibana/kibana-original.svg" alt="bash" width="40" height="40"/> </a>

- **Logstash**:
  - **Port**: 9600
  - **Purpose**: Collects and processes logs from various sources.
- **Elasticsearch**:
  - **Port**: 9200
  - **Purpose**: Stores and indexes logs for search and analysis.
- **Kibana**:
  - **Port**: 5601
  - **Purpose**: Provides a web interface for visualizing and querying logs.

#### 2. **[Monitoring System](https://github.com/AhmedFatir/Prometheus-Grafana)**
<a href="https://prometheus.io/" target="_blank" rel="noreferrer"> <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/prometheus/prometheus-original.svg" alt="bash" width="40" height="40"/> </a>
<a href="https://grafana.com/" target="_blank" rel="noreferrer"> <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/grafana/grafana-original.svg" alt="bash" width="40" height="40"/> </a>

- **[Prometheus](https://prometheus.io/)**:
  - **Port**: 9090
  - **Purpose**: Collects metrics from exporters and provides monitoring capabilities.
- **[Grafana](https://grafana.com/)**:
  - **Port**: 3000
  - **Purpose**: Visualizes metrics and provides dashboards for monitoring.
- **[Alertmanager](https://prometheus.io/docs/alerting/latest/alertmanager/)**:
  - **Port**: 9093
  - **Purpose**: Handles alerts generated by Prometheus and sends notifications (e.g., via SMTP).

#### 3. **Exporters**
- **[NGINX Exporter](https://grafana.com/grafana/dashboards/12708-nginx/)**:
  - **Port**: 9113
  - **Purpose**: Exposes metrics for the NGINX service.
- **[PostgreSQL Exporter](https://grafana.com/oss/prometheus/exporters/postgres-exporter/)**:
  - **Port**: 9187
  - **Purpose**: Exposes metrics for the PostgreSQL database.
- **[Redis Exporter](https://grafana.com/oss/prometheus/exporters/redis-exporter/)**:
  - **Port**: 9121
  - **Purpose**: Exposes metrics for the Redis cache.
- **[Node Exporter](https://prometheus.io/docs/guides/node-exporter/)**:
  - **Port**: 9100
  - **Purpose**: Exposes metrics about the host machine.


## System Specification
- This project is run using **Docker Desktop** on a **macOS** machine.
- If you are running this project on a different architecture, you may need to adjust the configurations accordingly.


## Setup
### if you already have docker and docker-compose installed on your machine
```bash
git clone https://github.com/BadrKali/ft_transcendence.git

cd ./ft_transcendence && make

# Befor running the project, you need to create a .env file in the root directory the .env.example file is provided as a template.


# And then you can access:
# Web Application: https://localhost
# Grafana: https://localhost:3000
# Prometheus: https://localhost:9090
# Alertmanager: https://localhost:9093
# Kibana: https://localhost:5601
```
---

### if you don't have docker and docker-compose on your machine
```bash
apt install curl

apt install docker.io

curl -O -J -L https://github.com/docker/compose/releases/download/v2.11.2/docker-compose-linux-x86_64

chmod +x docker-compose-linux-x86_64

cp ./docker-compose-linux-x86_64 /usr/bin/docker-compose
```
---

## if you are a 42 student and want to run this project on the school's Mac, you may need to change the path where Docker Desktop on Mac stores its data.
```bash
# Make sure Docker Desktop is not running.

# Use the rsync command to copy the Docker data directory to the new location.
rsync -a ~/Library/Containers/com.docker.docker ~/goinfre/DockerData

# Rename the original directory as a backup, just in case you need to revert.
mv ~/Library/Containers/com.docker.docker ~/Library/Containers/com.docker.docker.backup

# Create a symbolic link from the new location back to the original location.
ln -s ~/goinfre/DockerData/com.docker.docker ~/Library/Containers/com.docker.docker

# Open Docker > Preferences > Resources > File Sharing > Add ~/goinfre to Shared Paths.
```