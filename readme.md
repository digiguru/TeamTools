Start mini server

{{$ python -mSimpleHTTPServer 8080}}

Get typings
{{tsd install require}}

Rebuild in VS Code

{{cmd+shift+p  task (run task) then shoose the part to re-compile}}

Deploy to live

{{git push heroku master}}

Run the tests localy

{{npm test}}

Or hit debug button in VSCode
