
install: deps

deps:
	npm install

watch:
	while sleep 1; do \
		find Makefile .jshintrc src/ test/ \
		| entr -d make hint test; \
	done

test:
	./node_modules/.bin/mocha --recursive test/spec

hint:
	./node_modules/.bin/jscs src/
	./node_modules/.bin/jshint src/ test/spec

clean:
	rm -rf node_modules

.PHONY: test clean
