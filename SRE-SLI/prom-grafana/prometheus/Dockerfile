FROM prom/prometheus:v2.54.1 as prometheus
FROM prom/alertmanager:v0.25.0 as alertmanager
FROM alpine:3.20

# Install necessary packages
RUN apk update && apk add --no-cache \
    ca-certificates \
    openssl \
    gettext \
    && rm -rf /var/cache/apk/*

# Create Prometheus user and directories
RUN addgroup -S prometheus && adduser -S -G prometheus prometheus \
    && mkdir -p \
    /etc/prometheus /var/lib/prometheus \
    /etc/alertmanager /var/lib/alertmanager \
    && chown -R prometheus:prometheus \
    /etc/prometheus /var/lib/prometheus \
    /etc/alertmanager /var/lib/alertmanager

# Copy Prometheus and Alertmanager binaries from official images
COPY --from=prometheus /bin/prometheus /bin/promtool /usr/local/bin/
COPY --from=alertmanager /bin/alertmanager /bin/amtool /usr/local/bin/

# Copy Prometheus and Alertmanager web files from official images
RUN chown -R prometheus:prometheus \
    /usr/local/bin/prometheus /usr/local/bin/promtool \
    /usr/local/bin/alertmanager /usr/local/bin/amtool

# Generate a self-signed SSL certificate
RUN openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout /etc/prometheus/prometheus.key \
    -out /etc/prometheus/prometheus.crt \
    -subj "/C=MO/ST=KH/L=KH/O=1337/OU=1337/CN=localhost/UID=user"

# Copy SSL certificates to Alertmanager directory
RUN cp /etc/prometheus/prometheus.key /etc/alertmanager/alertmanager.key && \
    cp /etc/prometheus/prometheus.crt /etc/alertmanager/alertmanager.crt \
    && chown prometheus:prometheus \
    /etc/prometheus/prometheus.key /etc/prometheus/prometheus.crt \
    /etc/alertmanager/alertmanager.key /etc/alertmanager/alertmanager.crt

# Copy Prometheus & Alertmanager configuration files and alert rules
COPY ./prom-config/ /etc/prometheus/
COPY ./alert-config/ /etc/alertmanager/

# Make the startup script executable
RUN chmod +x /etc/prometheus/start_services.sh

# Run Prometheus and Alertmanager as a non-root user
USER prometheus

# Start both Prometheus and Alertmanager using a startup script
CMD ["/etc/prometheus/start_services.sh"]