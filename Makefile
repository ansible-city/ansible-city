
deps:
	npm install

watch:
	while sleep 1; do \
		find src/ test/ \
		| entr -d make test; \
	done

test:
	./node_modules/.bin/mocha --recursive test/spec

clean:
	rm -rf node_modules

.PHONY: test clean
