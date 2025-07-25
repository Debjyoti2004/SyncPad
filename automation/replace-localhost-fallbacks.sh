#!/bin/bash

# -----------------------------------------------------------------------------
# Replace only 'localhost' in fallback URLs with the EC2 public IP.
# Maintained by: Debjyoti Shit
# -----------------------------------------------------------------------------

set -euo pipefail

# Configuration
INSTANCE_ID="i-08521922dfc29c88d"
AWS_REGION="us-east-1"
FILE1="../apps/frontend/app/config.ts"
FILE2="../packages/backend-common-file/src/config.ts"

# Fetch EC2 Public IP
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

# Function to replace 'localhost' with IP in a file
replace_localhost_with_ip() {
  local file="$1"
  if [[ ! -f "$file" ]]; then
    echo "File not found: $file"
    exit 1
  fi

  echo "🔧 Replacing 'localhost' with $IP_ADDRESS in $file"
  sed -i.bak -E "s|localhost|$IP_ADDRESS|g" "$file"
}

# Replace in both files
replace_localhost_with_ip "$FILE1"
replace_localhost_with_ip "$FILE2"

echo "✅ All fallback URLs updated with EC2 IP: $IP_ADDRESS"
