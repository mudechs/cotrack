# CoTrack Ticket-System

Project and Team based Ticket-System using AdonisJs 4.1

## Version
0.9 BETA

## Current language
German (translation not implemented yet)

## Working demo
coming soon...

## Used technologies
- [AdonisJs 4.1](https://adonisjs.com/)
- [Bootstrap 4.2.1](https://getbootstrap.com/)
- [Bootswatch Bootstrap Theme (Slate)](https://bootswatch.com/)
- [FontAwesome Free Icons 5.x](https://fontawesome.com/)
- [MySQL 5.7.x](https://dev.mysql.com/)
- [Webpack 4.x](https://webpack.js.org/)
- [jQuery 3.x](https://jquery.com/)
- [DataTables 1.10.x](https://datatables.net/)
- [Dragula Drag&Drop 3.x](https://github.com/bevacqua/dragula/)
- [Bootstrap Multiselect 0.9.x](https://github.com/davidstutz/bootstrap-multiselect/)
- HTML5
- CSS3
- ES6 JavaScript
- [Visual Studio Code](https://code.visualstudio.com/)

## Usage

Install dependencies

```bash
npm install
```

### Database setup
Edit your .env file to include the correct DB credentials

### Migrations
Run the following command to run startup migrations.

```js
adonis migration:run
```

### Seeding Admin-User

Run the following command to run startup migrations.

```js
adonis seed
```

### Packing Assets

```js
./node_modules/.bin/webpack
```

### Run Server (nodemon suggested)

```bash
adonis serve --dev
```

or

```bash
nodemon server.js
```

### Login with Admin-User
- Username: admin
- Password: Nkz8289TMU

## API
There can be created Tickets from other Applications. As identifiers are used two fields:

### E-Mail
The JSON key `email` will be checked and assigned against a active user in the cotrack database.

### Project
The JSON key `project` will be checked and assigned against a existing and active project in the database. The request value will be matched
with the database field `code` in the `projects`-table.

### Token
The JSON key `token` will be checked against the deposited token in `.env` config file.

### Request format
```json
{
	"token": "xxxxxxxx",
	"subject": "The subject of the ticket",
	"description": "This is the description of the Ticket",
	"priority": "Normal or Hoch or Dringend",
	"email": "user@domain.com",
	"first_name": "Hans",
	"last_name": "Muster",
	"project": "xxx"
}
```

---

# License
Copyright 2019 Omar De-Giuli Custom Websolutions

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
