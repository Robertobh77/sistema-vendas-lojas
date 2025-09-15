#!/bin/bash

echo "Building frontend..."
cd frontend
npm install --legacy-peer-deps
npm run build
cd ..

echo "Copying build files to static folder..."
rm -rf src/static
cp -r frontend/dist src/static

echo "Build completed!"

