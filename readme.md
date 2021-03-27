# Team Tools

TeamTools is a migration of an old project to help teams vote on the tuckman model in an anonymous fashion, but get instant results.

It was originally created in RaphaelJS, but has gone through a number of iteractions (including D3) to end up as a ReactApp in Typescript using raw SVG.

See a [demo of it running](https://teamtools.herokuapp.com/) at Heroku.

## Tasks

- [x] CI/CD
- [x] Unit Test results in CI/CD
- [x] Add Users
- [x] Delete Users
- [x] Don't allow add of users with the same name
- [ ] Link user entry up with application
- [ ] Get tests useful & working
- [ ] Force tests to parse before builds get deployed
- [ ] Fix the entry page (was hashed together in vanilla javascript and hasn't yet been migrated)
- [ ] Work out errors when 3 people log their data
- [ ] Add socket integration
- [ ] Purge redundant code

## Development

1) Install node
2) Checkout code
3) `npm i`
4) `npm start`

To deploy to live, just commit changes to `Master` on https://github.com/digiguru/TeamTools

Run the tests localy

```bash
npm test
```
