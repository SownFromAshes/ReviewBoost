#!/bin/bash
# =========================================================
# deploy-stripe-webhook.sh
#
# How to use this script:
# 1. Save this file as deploy-stripe-webhook.sh
# 2. Make it executable:
#      chmod +x deploy-stripe-webhook.sh
# 3. Run the script:
#      ./deploy-stripe-webhook.sh
#
# The script will:
#   - Build the Stripe webhook edge function
#   - Deploy it to Supabase
#   - Test it with a sample webhook event
#   - Show logs and the test result {"received": true}
# =========================================================

# Load environment variables from .env
if [ -f .env ]; then
  export $(grep -v '^#' .env | xargs)
else
  echo ".env file not found. Please create one with SUPABASE_SERVICE_ROLE_KEY and USER_ACCESS_TOKEN"
  exit 1
fi

if [ -z "$SUPABASE_SERVICE_ROLE_KEY" ] || [ -z "$USER_ACCESS_TOKEN" ]; then
  echo "SUPABASE_SERVICE_ROLE_KEY or USER_ACCESS_TOKEN is missing in .env"
  exit 1
fi

FUNCTION_NAME="stripe-webhook"
PROJECT_URL="https://poysowfpgymbfhuavhqj.supabase.co/functions/v1/$FUNCTION_NAME"

# --- STEP 1: Build ---
echo "Building $FUNCTION_NAME..."
supabase functions build $FUNCTION_NAME || { echo "Build failed"; exit 1; }

# --- STEP 2: Deploy ---
echo "Deploying $FUNCTION_NAME..."
supabase functions deploy $FUNCTION_NAME || { echo "Deploy failed"; exit 1; }

# --- STEP 3: Test ---
echo "Testing $FUNCTION_NAME..."
curl -L -X POST "$PROJECT_URL" \
  -H "Authorization: Bearer $USER_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
        "id": "evt_test_webhook",
        "type": "checkout.session.completed",
        "data": { "object": { "customer": "cus_test123" } }
      }'

echo -e "\n✅ Done!"
