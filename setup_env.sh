#!/bin/bash
export SECRET_KEY='django-insecure-development-key-12345'
export DEBUG=True
export ALLOWED_HOSTS='*'
export DATABASE_URL='sqlite:///db.sqlite3'

echo "Environment variables set successfully!"
echo "Now run: python manage.py migrate"
