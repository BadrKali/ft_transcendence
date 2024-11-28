#!/bin/sh

npm i -g serve
npm run build
serve -s build -l 3000