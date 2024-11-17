global:
  resolve_timeout: 1h

route:
  receiver: 'email'
  group_by: ['alertsname']
  group_wait: 20s
  group_interval: 2m
  repeat_interval: 30m

receivers:
  - name: 'email'
    email_configs:
      - send_resolved: true
        to: '${EMAIL}'
        from: 'alertmanager@gmail.com'
        smarthost: 'smtp.gmail.com:587'
        auth_username: '${EMAIL}'
        auth_identity: '${EMAIL}'
        auth_password: '${EPASS}'
        require_tls: true