FROM grafana/grafana:latest

USER root

# Install necessary packages
RUN apk update && apk add --no-cache \
    openssl \
    && rm -rf /var/cache/apk/*

# Generate a self-signed SSL certificate
RUN mkdir -p /etc/grafana/ssl && \
    openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout /etc/grafana/ssl/grafana.key \
    -out /etc/grafana/ssl/grafana.crt \
    -subj "/C=MO/ST=KH/L=KH/O=1337/OU=1337/CN=localhost/UID=user"

# Set password and username for Grafana
ENV GF_SECURITY_ADMIN_USER=${GF_SECURITY_ADMIN_USER}
ENV GF_SECURITY_ADMIN_PASSWORD=${GF_SECURITY_ADMIN_PASSWORD}

# Copy custom configuration files
COPY ./config/grafana.ini /etc/grafana/grafana.ini
COPY ./config/provisioning /etc/grafana/provisioning
COPY ./dashboards /etc/grafana/dashboards

# Ensure grafana user owns all configuration files
RUN chown -R grafana:root /etc/grafana

USER grafana
