#!/bin/bash

echo "🔍 正在获取 VM 公网 IP..."
export VM_PUBLIC_IP=$(curl -s http://ifconfig.me)

echo "🌐 公网 IP 检测到为: $VM_PUBLIC_IP"

echo "📦 替换变量并启动 Kafka 集群..."
envsubst < docker-compose.yml > docker-compose.final.yml

docker-compose -f docker-compose.final.yml up -d
