#!/bin/bash

cd src/frontend
yarn install
yarn build
rm -rf ../main/resources/static/*
cp -r dist/* ../main/resources/static/

echo "✅ React 빌드 완료 및 Spring Boot 정적 리소스 복사 완료!"

