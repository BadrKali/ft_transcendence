FROM alpine:3.20

RUN apk update && apk add --no-cache \
    ca-certificates openssl gettext \
    && rm -rf /var/cache/apk/*

COPY --from=prom/prometheus:v2.54.1 /bin/prometheus /usr/local/bin/prometheus
COPY --from=prom/alertmanager:v0.25.0 /bin/alertmanager /usr/local/bin/alertmanager

RUN addgroup -S prometheus && adduser -S -G prometheus prometheus \
    && mkdir -p /etc/prometheus /etc/alertmanager \
    /var/lib/prometheus /var/lib/alertmanager

RUN openssl req -x509 -nodes -days 365 \
    -keyout /etc/prometheus/prometheus.key \
    -out /etc/prometheus/prometheus.crt \
    -subj "/C=MO/ST=KH/L=KH/O=1337/OU=1337/CN=localhost/UID=prometheus" && \
    cp /etc/prometheus/prometheus.key /etc/alertmanager/alertmanager.key && \
    cp /etc/prometheus/prometheus.crt /etc/alertmanager/alertmanager.crt

RUN chown -R prometheus:prometheus \
    /usr/local/bin/prometheus /usr/local/bin/alertmanager \
    /etc/prometheus /etc/alertmanager \
    /var/lib/prometheus /var/lib/alertmanager

COPY ./prom-config/ /etc/prometheus/
COPY ./alert-config/ /etc/alertmanager/

RUN chmod +x /etc/prometheus/start_services.sh
USER prometheus

CMD ["/etc/prometheus/start_services.sh"]