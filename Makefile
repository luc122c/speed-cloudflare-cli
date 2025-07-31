# Define the output binary name
BINARY = cloudflare-speedtest

# Any args to use when testing
ARG ?= ""

# Phony targets that don't correspond to files
.PHONY: test integration-test clean

# Default target to compile the CLI tool
all: $(BINARY)

$(BINARY): cli.js
	deno compile --unstable-detect-cjs --allow-net --output=$@ $<

clean:
	rm -f $(BINARY)

test:
	npm test

integration-test: $(BINARY)
	./$(BINARY) $(ARG)
