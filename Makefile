install:
	npm install
usage:
	npm run babel-node -- src/bin/gendiff.js --help
test-run:
	npm run babel-node -- src/bin/gendiff.js __tests__/__fixtures__/befor.json __tests__/__fixtures__/after.json
build:
	npm run build
publish:
	npm publish
lint:
	npm run eslint .
test:
	npm test

