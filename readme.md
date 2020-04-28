Start mini server

{{$ python -mSimpleHTTPServer 8080}}

~Get typings~
{{tsd install require}}
(not required anymore as built into NPM)


Rebuild in VS Code

{{cmd+shift+p  task (run task) then choose the part to re-compile}}

Alternativly you can use gulp

{{gulp Build}}

or even better npm

{{npm run build}}

Deploy to live

{{git push heroku master}}

Run the tests localy

{{npm test}}

Or hit debug button in VSCode

If you want to update the snapshots produced by the tests use

{{npm run jest-update}}

And to load the snapshot previewer use...

{{npm run jest-html}}
