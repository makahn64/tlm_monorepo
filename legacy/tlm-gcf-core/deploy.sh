#!/bin/zsh
gcloud functions deploy tlm --env-vars-file .env.production.yaml --runtime nodejs12 --trigger-http --entry-point app
