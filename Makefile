SHELL := /bin/bash
index.html: index.md style.css Makefile bundle.js style.css
	pandoc --template template.html -s -c style.css --smart --normalize --html-q-tags -t html5 --section-divs -o index.html -V js=bundle.js index.md

bundle.js: main.js
	browserify -d main.js > bundle.js

