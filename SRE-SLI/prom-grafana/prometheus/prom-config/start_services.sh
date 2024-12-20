#!/bin/sh

envsubst < /etc/alertmanager/alertmanager.yml.tpl > /etc/alertmanager/alertmanager.yml

/usr/local/bin/prometheus \
  --config.file=/etc/prometheus/prometheus.yml \
  --storage.tsdb.path=/var/lib/prometheus \
  --web.listen-address=:9090 \
  --storage.tsdb.retention.time=7d \
  --web.config.file=/etc/prometheus/web-config.yml &

/usr/local/bin/alertmanager \
  --config.file=/etc/alertmanager/alertmanager.yml \
  --storage.path=/var/lib/alertmanager \
  --web.listen-address=:9093 \
  --web.config.file=/etc/alertmanager/web-config.yml &

wait