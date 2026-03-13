# Infrastructure Deployment & Operations Guide

**Purpose:** Production deployment and operations for Tourney Hub Plus at scale  
**Target:** Thousands of concurrent users, millions of match records  
**Environment:** Kubernetes, Docker, PostgreSQL, Redis, AWS/GCP

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                     Load Balancer Layer                          │
│  (nginx/HAProxy) - SSL termination, rate limiting, routing        │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                    API Gateway (Kong/Ambassador)                 │
│  (Request validation, auth, API versioning, monitoring)          │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌──────────────────────────────────┬──────────────────────────────┐
│  Application Pods (5-50 replicas)│  WebSocket Pods (2-10)       │
│  - Tournament API               │  - Real-time subscriptions    │
│  - Teams API                    │  - Match updates              │
│  - Players API                  │  - Score notifications        │
│  - Matches API                  │  - Live events                │
│  (Auto-scales on CPU/Memory)    │  (Sticky sessions)            │
└──────────────────────────────────┴──────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                    Data Layer Cache                              │
│  Redis Cluster (3 nodes, 16GB each) - Session store, cache       │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                    Data Layer Storage                            │
│  PostgreSQL Primary - Write operations                           │
│       ├─ Read Replica 1 (Region 1)                              │
│       ├─ Read Replica 2 (Region 2)                              │
│       └─ Read Replica 3 (Standby)                               │
│  PgBouncer - Connection pooling (50 pools × 100 = 5K max)        │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌──────────────────────────────────┬──────────────────────────────┐
│  Background Job Queue            │  Storage Services            │
│  - BullMQ + Redis                │  - AWS S3/GCS for media      │
│  - 3-tier priority workers       │  - Image resize Lambda       │
│  - 5-10 worker pods              │  - CDN (CloudFront/Akamai)   │
└──────────────────────────────────┴──────────────────────────────┘
                              ↓
┌──────────────────────────────────┬──────────────────────────────┐
│  Monitoring & Analytics          │  Logging & Tracing           │
│  - Prometheus + Grafana          │  - ELK Stack / Loki          │
│  - Custom dashboards             │  - Jaeger tracing            │
│  - Alerting (PagerDuty)          │  - Centralized logs          │
└──────────────────────────────────┴──────────────────────────────┘
```

---

## 📦 Docker Configuration

### Dockerfile for Node.js API

```dockerfile
# Multi-stage build
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

FROM node:18-alpine
WORKDIR /app

# Security: non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

# Copy built dependencies
COPY --from=builder --chown=nodejs:nodejs /app/node_modules ./node_modules

# Copy application
COPY --chown=nodejs:nodejs . .

# Build TypeScript
RUN npm run build

USER nodejs

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

EXPOSE 3000
CMD ["npm", "start"]
```

### docker-compose.yml for Local Development

```yaml
version: '3.8'

services:
  # PostgreSQL Database
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: LocalDevPass123
      POSTGRES_DB: tourney_hub
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./supabase/migrations:/docker-entrypoint-initdb.d  # Auto-run migrations
    ports:
      - "5432:5432"
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5

  # Redis Cache
  redis:
    image: redis:7-alpine
    command: redis-server --appendonly yes --maxmemory 256mb --maxmemory-policy allkeys-lru
    volumes:
      - redis_data:/data
    ports:
      - "6379:6379"
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 3s
      retries: 3

  # API Server
  api:
    build:
      context: .
      dockerfile: Dockerfile
    environment:
      DATABASE_URL: postgresql://postgres:LocalDevPass123@postgres:5432/tourney_hub
      REDIS_URL: redis://redis:6379
      NODE_ENV: development
      JWT_SECRET: dev-secret-key-do-not-use-in-production
      VITE_API_URL: http://localhost:3000
    ports:
      - "3000:3000"
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
    volumes:
      - .:/app
      - /app/node_modules
    command: npm run dev

  # pgAdmin (Database Management)
  pgadmin:
    image: dpage/pgadmin4:latest
    environment:
      PGADMIN_DEFAULT_EMAIL: admin@tourneyhub.local
      PGADMIN_DEFAULT_PASSWORD: AdminPass123
    ports:
      - "5050:80"
    volumes:
      - pgadmin_data:/var/lib/pgadmin

volumes:
  postgres_data:
  redis_data:
  pgadmin_data:

networks:
  default:
    name: tourney-hub-net
```

---

## ☸️ Kubernetes Deployment

### Namespace and Network Policies

```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: tourney-hub
  labels:
    environment: production

---
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: default-deny-all
  namespace: tourney-hub
spec:
  podSelector: {}
  policyTypes:
  - Ingress
  - Egress

---
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: allow-api-to-db
  namespace: tourney-hub
spec:
  podSelector:
    matchLabels:
      app: api
  policyTypes:
  - Egress
  egress:
  - to:
    - podSelector:
        matchLabels:
          app: postgres
    ports:
    - protocol: TCP
      port: 5432
  - to:
    - podSelector:
        matchLabels:
          app: redis
    ports:
    - protocol: TCP
      port: 6379
```

### ConfigMap for Environment Variables

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: api-config
  namespace: tourney-hub
data:
  NODE_ENV: "production"
  LOG_LEVEL: "info"
  VITE_API_URL: "https://api.tourneyhub.com"
  DATABASE_POOL_MIN: "10"
  DATABASE_POOL_MAX: "100"
  REDIS_MAX_RETRY_ATTEMPTS: "3"
  JWT_EXPIRES_IN: "24h"
  SESSION_TTL: "86400000"  # 24 hours in ms
  CACHE_TTL_SHORT: "900"   # 15 minutes
  CACHE_TTL_LONG: "86400"  # 24 hours
```

### Secret for Credentials

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: api-secrets
  namespace: tourney-hub
type: Opaque
data:
  DATABASE_URL: <base64-encoded-db-url>
  JWT_SECRET: <base64-encoded-secret>
  REDIS_AUTH: <base64-encoded-redis-password>
  AWS_ACCESS_KEY_ID: <base64-encoded-key>
  AWS_SECRET_ACCESS_KEY: <base64-encoded-secret>
  SUPABASE_KEY: <base64-encoded-key>
```

### API Deployment (Auto-Scaling)

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: api
  namespace: tourney-hub
  labels:
    app: api
spec:
  replicas: 3  # Initial replicas
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1        # 1 extra pod during update
      maxUnavailable: 0  # No downtime
  selector:
    matchLabels:
      app: api
  template:
    metadata:
      labels:
        app: api
        version: v1
      annotations:
        prometheus.io/scrape: "true"
        prometheus.io/port: "3000"
        prometheus.io/path: "/metrics"
    spec:
      affinity:
        podAntiAffinity:
          preferredDuringSchedulingIgnoredDuringExecution:
          - weight: 100
            podAffinityTerm:
              labelSelector:
                matchExpressions:
                - key: app
                  operator: In
                  values:
                  - api
              topologyKey: kubernetes.io/hostname
      containers:
      - name: api
        image: registry.tourneyhub.com/api:v1.0.0
        imagePullPolicy: IfNotPresent
        ports:
        - containerPort: 3000
          name: http
          protocol: TCP
        envFrom:
        - configMapRef:
            name: api-config
        - secretRef:
            name: api-secrets
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 10
          timeoutSeconds: 5
          failureThreshold: 3
        readinessProbe:
          httpGet:
            path: /health/ready
            port: 3000
          initialDelaySeconds: 5
          periodSeconds: 5
          timeoutSeconds: 3
          failureThreshold: 2
        securityContext:
          runAsNonRoot: true
          runAsUser: 1001
          allowPrivilegeEscalation: false
          readOnlyRootFilesystem: true
        volumeMounts:
        - name: tmp
          mountPath: /tmp
        - name: cache
          mountPath: /app/.cache
      volumes:
      - name: tmp
        emptyDir: {}
      - name: cache
        emptyDir: {}
      terminationGracePeriodSeconds: 30

---
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: api-hpa
  namespace: tourney-hub
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: api
  minReplicas: 3
  maxReplicas: 50
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
  - type: Resource
    resource:
      name: memory
      target:
        type: Utilization
        averageUtilization: 80
  behavior:
    scaleDown:
      stabilizationWindowSeconds: 300
      policies:
      - type: Percent
        value: 50
        periodSeconds: 60
    scaleUp:
      stabilizationWindowSeconds: 0
      policies:
      - type: Percent
        value: 100
        periodSeconds: 30
      - type: Pods
        value: 5
        periodSeconds: 60
      selectPolicy: Max
```

### Service and Ingress

```yaml
apiVersion: v1
kind: Service
metadata:
  name: api-service
  namespace: tourney-hub
  labels:
    app: api
spec:
  type: ClusterIP
  selector:
    app: api
  ports:
  - port: 80
    targetPort: 3000
    protocol: TCP
    name: http
  sessionAffinity: None

---
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: api-ingress
  namespace: tourney-hub
  annotations:
    cert-manager.io/cluster-issuer: "letsencrypt-prod"
    nginx.ingress.kubernetes.io/rate-limit: "1000"
    nginx.ingress.kubernetes.io/ssl-redirect: "true"
spec:
  ingressClassName: nginx
  tls:
  - hosts:
    - api.tourneyhub.com
    secretName: api-tls-cert
  rules:
  - host: api.tourneyhub.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: api-service
            port:
              number: 80
  - host: api-v2.tourneyhub.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: api-service
            port:
              number: 80
```

---

## 🗄️ PostgreSQL Deployment

### Kubernetes StatefulSet for PostgreSQL

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: postgres-pvc
  namespace: tourney-hub
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 100Gi
  storageClassName: fast-ssd

---
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: postgres
  namespace: tourney-hub
spec:
  serviceName: postgres-service
  replicas: 1
  selector:
    matchLabels:
      app: postgres
  template:
    metadata:
      labels:
        app: postgres
    spec:
      containers:
      - name: postgres
        image: postgres:15-alpine
        ports:
        - containerPort: 5432
          name: postgres
        env:
        - name: POSTGRES_USER
          value: postgres
        - name: POSTGRES_DB
          value: tourney_hub
        - name: POSTGRES_PASSWORD
          valueFrom:
            secretKeyRef:
              name: postgres-secret
              key: password
        - name: PGDATA
          value: /var/lib/postgresql/data/pgdata
        volumeMounts:
        - name: postgres-storage
          mountPath: /var/lib/postgresql/data
        resources:
          requests:
            memory: "2Gi"
            cpu: "1000m"
          limits:
            memory: "4Gi"
            cpu: "2000m"
        livenessProbe:
          exec:
            command:
            - /bin/sh
            - -c
            - pg_isready -U postgres
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          exec:
            command:
            - /bin/sh
            - -c
            - pg_isready -U postgres
          initialDelaySeconds: 5
          periodSeconds: 5
  volumeClaimTemplates:
  - metadata:
      name: postgres-storage
    spec:
      accessModes: [ "ReadWriteOnce" ]
      storageClassName: fast-ssd
      resources:
        requests:
          storage: 100Gi

---
apiVersion: v1
kind: Service
metadata:
  name: postgres-service
  namespace: tourney-hub
spec:
  clusterIP: None
  selector:
    app: postgres
  ports:
  - port: 5432
    targetPort: 5432
```

### PostgreSQL Configuration for Scale

```ini
# postgresql.conf - Production settings

# Memory
shared_buffers = 8GB              # 25% of system RAM
effective_cache_size = 24GB       # 75% of system RAM
work_mem = 50MB                   # Per operation memory
maintenance_work_mem = 2GB        # For VACUUM/CREATE INDEX

# Connection settings
max_connections = 500
superuser_reserved_connections = 10
tcp_keepalives_idle = 60
tcp_keepalives_interval = 30
tcp_keepalives_count = 10

# WAL & Replication
wal_level = replica
max_wal_senders = 5
wal_keep_size = 2GB
hot_standby = on
hot_standby_feedback = on

# Query optimization
random_page_cost = 1.1            # For SSD
effective_io_concurrency = 200
max_worker_processes = 4
max_parallel_workers_per_gather = 2
max_parallel_workers = 4

# Logging
log_min_duration_statement = 100  # Log queries > 100ms
log_statement = 'mod'             # Log DDL/DML modifications
log_connections = on
log_disconnections = on
log_duration = off
log_lock_waits = on
log_line_prefix = '%t [%p]: [%l-1] user=%u,db=%d,app=%a,client=%h '

# Performance
jit = on
random_page_cost = 1.1
default_statistics_target = 100

# AutoVacuum & Maintenance
autovacuum_max_workers = 4
autovacuum_naptime = '10s'
autovacuum_vacuum_threshold = 50
autovacuum_vacuum_scale_factor = 0.05
autovacuum_analyze_threshold = 10
autovacuum_analyze_scale_factor = 0.01
```

---

## 🔄 Database Replication Setup

### Streaming Replication to Read Replicas

```bash
#!/bin/bash
# setup-replication.sh - Run on primary server

REPLICA_USER="replicator"
REPLICA_PASSWORD="RandomSecure123"

# 1. Create replication user on primary
psql -U postgres -d postgres << EOF
CREATE ROLE $REPLICA_USER WITH REPLICATION LOGIN PASSWORD '$REPLICA_PASSWORD';
GRANT CONNECT ON DATABASE tourney_hub TO $REPLICA_USER;
EOF

# 2. Update postgresql.conf
cat >> /var/lib/postgresql/data/postgresql.conf << EOF
wal_level = replica
max_wal_senders = 5
wal_keep_size = 2GB
hot_standby = on
EOF

# 3. Update pg_hba.conf
echo "host replication $REPLICA_USER 0.0.0.0/0 md5" >> /var/lib/postgresql/data/pg_hba.conf

# 4. Restart PostgreSQL
systemctl restart postgresql

# 5. Create base backup for replicas
pg_basebackup -h primary-host -D /replica1/data -U replicator -v
```

### Recovery Configuration for Replicas

```conf
# recovery.conf on replica servers

standby_mode = 'on'
primary_conninfo = 'host=primary-host user=replicator password=RandomSecure123 port=5432 sslmode=prefer'
restore_command = 'cp /archive/%f "%p"'
recovery_target_timeline = 'latest'
hot_standby_feedback = on  # Don't kill queries if primary is far ahead
```

---

## 🔒 Redis Cluster Deployment

### Redis Cluster Helm Chart Values

```yaml
# redis-cluster-values.yaml
redis-ha:
  enabled: true
  replicas:
    - master-0: {}
    - master-1: {}
    - master-2: {}
  
  redis:
    config:
      maxmemory: "16gb"
      maxmemory-policy: "allkeys-lru"  # Evict least recently used keys
      timeout: 300
      tcp-keepalive: 60
      
  sentinel:
    quorum: 2
    enabled: true
    
  persistence:
    enabled: true
    size: 20Gi
    storageClassName: "fast-ssd"
```

### Connection Pooling with PgBouncer

```ini
# pgbouncer.ini

[databases]
tourney_hub = host=primary-postgres port=5432 dbname=tourney_hub

[pgbouncer]
listen_port = 6432
listen_addr = 0.0.0.0

pool_mode = transaction        # Transaction pooling for API
max_client_conn = 10000        # Max client connections
default_pool_size = 100        # Connections per database
min_pool_size = 10
reserve_pool_size = 5          # Reserve for admin
reserve_pool_timeout = 3
max_db_connections = 500       # Max to actual database
max_user_connections = 500

# Security
auth_type = md5
auth_file = /etc/pgbouncer/users.txt

# Monitoring
stats_period = 60
```

---

## 📊 Monitoring & Observability

### Prometheus Configuration

```yaml
# prometheus.yml
global:
  scrape_interval: 15s
  evaluation_interval: 15s

alerting:
  alertmanagers:
  - static_configs:
    - targets:
      - localhost:9093

rule_files:
- /etc/prometheus/rules/*.yml

scrape_configs:
  - job_name: 'api'
    kubernetes_sd_configs:
    - role: pod
      namespaces:
        names:
        - tourney-hub
    relabel_configs:
    - source_labels: [__meta_kubernetes_pod_label_app]
      action: keep
      regex: api
    - source_labels: [__meta_kubernetes_pod_name]
      target_label: pod

  - job_name: 'postgres'
    static_configs:
    - targets: ['postgres-exporter:9187']

  - job_name: 'redis'
    static_configs:
    - targets: ['redis-exporter:9121']

  - job_name: 'kubernetes'
    kubernetes_sd_configs:
    - role: node
```

### Alert Rules

```yaml
# alert-rules.yml
groups:
- name: tourney_hub_alerts
  interval: 30s
  rules:
  - alert: HighErrorRate
    expr: rate(http_requests_total{status=~"5.."}[5m]) > 0.05
    for: 5m
    labels:
      severity: critical
    annotations:
      summary: "High error rate detected"

  - alert: DatabaseDown
    expr: pg_up == 0
    for: 1m
    labels:
      severity: critical
    annotations:
      summary: "PostgreSQL is down"

  - alert: HighCPUUsage
    expr: container_cpu_usage_seconds_total > 0.8
    for: 10m
    labels:
      severity: warning
    annotations:
      summary: "High CPU usage: {{ $value }}"

  - alert: HighMemoryUsage
    expr: container_memory_usage_bytes / container_spec_memory_limit_bytes > 0.85
    for: 5m
    labels:
      severity: warning
    annotations:
      summary: "High memory usage: {{ $value | humanizePercentage }}"

  - alert: RedisMemoryHigh
    expr: redis_memory_used_bytes / redis_memory_max_bytes > 0.85
    for: 5m
    labels:
      severity: warning
    annotations:
      summary: "Redis memory usage high: {{ $value | humanizePercentage }}"
```

### Grafana Dashboard Queries

```promql
# API Response Time (95th percentile)
histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))

# Requests Per Second
rate(http_requests_total[1m])

# Error Rate
rate(http_requests_total{status=~"5.."}[5m]) / rate(http_requests_total[5m])

# Database Connections
pg_stat_activity_count

# Database Query Performance
rate(pg_stat_statements_total_time[1m])

# Cache Hit Ratio
rate(redis_keyspace_hits_total[1m]) / (rate(redis_keyspace_hits_total[1m]) + rate(redis_keyspace_misses_total[1m]))

# Queue Depth
bullmq_queue_jobs_count{state="waiting"}
```

---

## 🚀 Deployment Checklist

### Pre-Deployment
- [ ] Database migrations tested locally
- [ ] SQL queries optimized (all < 200ms)
- [ ] Connection pooling configured
- [ ] Environment variables set
- [ ] SSL certificates ready
- [ ] Backup strategy tested
- [ ] Disaster recovery plan documented

### Deployment Steps
```bash
# 1. Build and push Docker image
docker build -t registry.tourneyhub.com/api:v1.0.0 .
docker push registry.tourneyhub.com/api:v1.0.0

# 2. Apply Kubernetes resources
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/configmap.yaml
kubectl apply -f k8s/secrets.yaml
kubectl apply -f k8s/postgres.yaml
kubectl apply -f k8s/api-deployment.yaml

# 3. Run database migrations
kubectl exec -it postgres-0 -n tourney-hub -- psql -U postgres -d tourney_hub -f /migrations/001-schema.sql

# 4. Verify deployment
kubectl get pods -n tourney-hub
kubectl logs -l app=api -n tourney-hub --tail=50

# 5. Health checks
curl https://api.tourneyhub.com/health
```

### Post-Deployment Verification
```bash
# 1. Check application health
kubectl get pods -n tourney-hub

# 2. Monitor metrics
open http://grafana.tourneyhub.com

# 3. Verify database replication
psql -h replica-1 -U postgres -d tourney_hub -c "SELECT * FROM pg_stat_replication;"

# 4. Test API endpoints
curl -H "Authorization: Bearer $TOKEN" https://api.tourneyhub.com/tournaments

# 5. Run smoke tests
npm run test:smoke
```

---

## 🔧 Maintenance Operations

### Database Maintenance

```bash
#!/bin/bash
# daily-maintenance.sh

# Run daily VACUUM
psql -U postgres tourney_hub -c "VACUUM ANALYZE;"

# Reindex unused indices
psql -U postgres tourney_hub -c "REINDEX DATABASE tourney_hub;"

# Check table bloat
psql -U postgres tourney_hub << EOF
SELECT schemaname, tablename, 
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables 
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
EOF

# Backup database
pg_dump -h postgres-primary -U postgres tourney_hub | gzip > /backup/tourney_hub_$(date +%Y%m%d).sql.gz
```

### Log Analysis

```bash
# Check error rate last hour
kubectl logs -l app=api -n tourney-hub --since=1h | grep ERROR | wc -l

# Get slow queries from logs
kubectl logs -l app=api -n tourney-hub | grep "duration: [1-9][0-9][0-9]" | tail -20

# Monitor real-time logs
kubectl logs -f -l app=api -n tourney-hub --all-containers=true
```

---

## 📋 Disaster Recovery

### Backup Strategy
- **Frequency:** Every 6 hours
- **Retention:** 30 days
- **Type:** Full backup + WAL archiving
- **Storage:** S3 with versioning enabled

### Restore Procedure
```bash
# 1. Stop application
kubectl scale deployment api --replicas=0 -n tourney-hub

# 2. Restore from backup
pg_restore -d tourney_hub /backup/tourney_hub_20240101.sql.gz

# 3. Verify integrity
psql -d tourney_hub -c "SELECT COUNT(*) FROM tournaments;"

# 4. Restart application
kubectl scale deployment api --replicas=3 -n tourney-hub
```

---

## 🎯 Performance Targets

| Metric | Target | Threshold |
|--------|--------|-----------|
| API Response Time (P95) | < 200ms | > 500ms ⚠️ |
| API Response Time (P99) | < 500ms | > 1000ms ⚠️ |
| Error Rate | < 0.1% | > 0.5% ⚠️ |
| Cache Hit Ratio | > 80% | < 60% ⚠️ |
| Database Connection Pool Utilization | < 70% | > 85% ⚠️ |
| Pod CPU Usage | < 70% | > 80% (scales) |
| Pod Memory Usage | < 80% | > 90% (scales) |
| Queue Processing Time | < 5 seconds | > 10 seconds ⚠️ |

