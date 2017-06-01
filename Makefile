.PHONY: clean check test

LIBDIR = lib
REPORTS = reports

all: node_modules lib

node_modules: package.json
	@rm -r $@
	@npm install
	@touch $@

check:
	@eslint --ext .js,.jsx ./src

test: node_modules clean check
	@jest

clean:
	@rm -rf $(LIBDIR)
	@rm -rf $(REPORTS)

lib: clean
	@NODE_ENV=rollup rollup -clean
