#!/bin/bash

# Check if config_env parameter is provided
if [ -z "$1" ]; then
    echo "Please provide config_env (dev/prod) as parameter"
    exit 1
fi

CONFIG_ENV=$1

# Deploy certificate stack in us-east-1
echo "Deploying certificate stack in us-east-1..."
aws cloudformation deploy \
    --template-file certificate.yaml \
    --stack-name "${CONFIG_ENV}-certificate" \
    --parameter-overrides \
        ProjectName="vite-react-${CONFIG_ENV}" \
        DomainName="dev.yourdomain.com" \
    --region us-east-1

# Get certificate ARN
CERT_ARN=$(aws cloudformation describe-stacks \
    --stack-name "${CONFIG_ENV}-certificate" \
    --query 'Stacks[0].Outputs[?OutputKey==`CertificateArn`].OutputValue' \
    --output text \
    --region us-east-1)

# Deploy main stack in eu-west-2
echo "Deploying main stack in eu-west-2..."
sam deploy \
    --config-env "$CONFIG_ENV" \
    --parameter-overrides "CertificateArn=$CERT_ARN"

# Build and deploy frontend assets
echo "Building frontend..."
npm run build

# Sync build output to S3
BUCKET_NAME=$(aws cloudformation describe-stacks \
    --stack-name "vite-react-${CONFIG_ENV}" \
    --query 'Stacks[0].Outputs[?OutputKey==`WebsiteBucketName`].OutputValue' \
    --output text \
    --region eu-west-2)

echo "Deploying frontend assets to S3..."
aws s3 sync dist/ "s3://${BUCKET_NAME}" --delete

# Invalidate CloudFront cache
DISTRIBUTION_ID=$(aws cloudformation describe-stacks \
    --stack-name "vite-react-${CONFIG_ENV}" \
    --query 'Stacks[0].Outputs[?OutputKey==`CloudFrontDistributionId`].OutputValue' \
    --output text \
    --region eu-west-2)

echo "Invalidating CloudFront cache..."
aws cloudfront create-invalidation --distribution-id "$DISTRIBUTION_ID" --paths "/*"

echo "Deployment complete!" 