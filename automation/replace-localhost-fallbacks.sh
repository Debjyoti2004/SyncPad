#!/bin/bash

# -----------------------------------------------------------------------------
# Update hardcoded localhost URLs in TypeScript config files with EC2 public IP.
# Maintained by: Debjyoti Shit
# Description: Replace localhost in fallback URLs with current EC2 public IP.
# -----------------------------------------------------------------------------

set -euo pipefail

#  Configuration 
INSTANCE_ID="i-0fd6386b421fdd1fe"
AWS_REGION="us-east-1"
PORT_HTTP="4001"
PORT_WS="4002"
PORT_FRONTEND="3000"

FILE1="../frontend/src/constants/backend.ts"
FILE2="../backend/src/config/env.ts"

#  Fetch EC2 Public IP 
echo "Fetching EC2 public IP for instance: $INSTANCE_ID"
IP_ADDRESS=$(aws ec2 describe-instances \
  --instance-ids "$INSTANCE_ID" \
  --region "$AWS_REGION" \
  --query 'Reservations[0].Instances[0].PublicIpAddress' \
  --output text)

if [[ -z "$IP_ADDRESS" || "$IP_ADDRESS" == "None" ]]; then
  echo "Could not fetch public IP. Exiting."
  exit 1
fi

#  Construct URLs 
NEW_HTTP_URL="http://${IP_ADDRESS}:${PORT_HTTP}"
NEW_WS_URL="ws://${IP_ADDRESS}:${PORT_WS}"
NEW_FRONTEND_URL="http://${IP_ADDRESS}:${PORT_FRONTEND}"

#  Update File 1 
if [[ ! -f "$FILE1" ]]; then
  echo "File not found: $FILE1"
  exit 1
fi

echo "Updating fallback URLs in $FILE1"
sed -i.bak -E \
  -e "s|process.env.BACKEND_URL \|\| \\"http://localhost:[0-9]+\\"|process.env.BACKEND_URL || \"$NEW_HTTP_URL\"|g" \
  -e "s|process.env.WEBSOCKET_URL \|\| \\"ws://localhost:[0-9]+\\"|process.env.WEBSOCKET_URL || \"$NEW_WS_URL\"|g" \
  "$FILE1"

#  Update File 2 
if [[ ! -f "$FILE2" ]]; then
  echo "File not found: $FILE2"
  exit 1
fi

echo "Updating fallback URLs in $FILE2"
sed -i.bak -E \
  -e "s|process.env.FRONTEND_URL \|\| \\"http://localhost:[0-9]+\\"|process.env.FRONTEND_URL || \"$NEW_FRONTEND_URL\"|g" \
  "$FILE2"

#  Done 
echo "All fallback URLs updated with EC2 IP: $IP_ADDRESS"
