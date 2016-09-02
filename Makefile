.DEFAULT_GOAL := help
.PHONY: help

## Run tests on any file change
watch: test_deps
	while sleep 1; do \
		find defaults/ meta/ tasks/ templates/ tests/test.yml tests/vagrant/Vagrantfile \
		| entr -d make lint vagrant; \
	done

## Run test
test: test_deps vagrant

test_deps:
	rm -f tests/ansible-city.composer
	ln -s .. tests/ansible-city.composer

## Start and (re)provisiom Vagrant test box
vagrant:
	cd tests/vagrant && vagrant up --no-provision
	cd tests/vagrant && vagrant provision

## Execute simple Vagrant command
# Example: make vagrant_ssh
#          make vagrant_halt
vagrant_%:
	cd tests/vagrant && vagrant $(subst vagrant_,,$@)

## Lint role
# You need to install ansible-lint
lint:
	ansible-playbook --syntax-check --list-tasks -i tests/inventory tests/test.yml
	find defaults/ meta/ tasks/ templates/ tests/test.yml -name "*.yml" \
		| xargs -I{} ansible-lint {}

## Clean up
clean:
	rm -rf tests/ansible-city.*
	cd tests/vagrant && vagrant destroy

## Print this help
help:
	@awk -v skip=1 \
		'/^##/ { sub(/^[#[:blank:]]*/, "", $$0); doc_h=$$0; doc=""; skip=0; next } \
		 skip  { next } \
		 /^#/  { doc=doc "\n" substr($$0, 2); next } \
		 /:/   { sub(/:.*/, "", $$0); printf "\033[34m%-30s\033[0m\033[1m%s\033[0m %s\n\n", $$0, doc_h, doc; skip=1 }' \
		$(MAKEFILE_LIST)
