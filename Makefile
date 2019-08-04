.PHONY: test

test:
	docker run --rm -p 8080:80 -v ${PWD}/dist/:/usr/share/nginx/html nginx
