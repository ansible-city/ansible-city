
## Downloads dependencies
deps:
	npm install

watch:
	while sleep 1; do \
		find Makefile .jshintrc src/ test/ \
		| entr -d make lint test; \
	done

test:
	./node_modules/.bin/mocha --recursive test/spec

lint:
	./node_modules/.bin/jscs src/
	./node_modules/.bin/jshint src/ test/spec

## Cleans folder
clean:
	rm -rf node_modules

## Prints this help
help:
	@awk 'BEGIN{ doc_mode=0; doc=""; doc_h=""; FS="#" } { \
		if (""!=$$3) { doc_mode=2 } \
		if (match($$1, /^[%.a-zA-Z_-]+:/) && doc_mode==1) { printf "\033[34m%-30s\033[0m\033[1m%s\033[0m %s\n\n", $$1, doc_h, doc; doc_mode=0; doc="" } \
		if (doc_mode==1) { $$1=""; doc=doc "\n" $$0 } \
		if (doc_mode==2) { doc_mode=1; doc_h=$$3 } }' $(MAKEFILE_LIST)

.PHONY: test
