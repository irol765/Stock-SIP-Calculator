#!/bin/sh

# Exit on error
set -e

# Replace placeholder with actual API Key in all JS files in the static folder
if [ -n "$API_KEY" ]; then
  echo "Injecting API Key..."
  # Use | as delimiter to avoid issues with / in base64 keys if any
  find /usr/share/nginx/html -name "*.js" -exec sed -i "s|__GEMINI_API_KEY_PLACEHOLDER__|$API_KEY|g" {} +
else
  echo "Warning: API_KEY environment variable not set. Application may not function correctly."
fi

# Execute the CMD from Dockerfile (nginx)
exec "$@"
