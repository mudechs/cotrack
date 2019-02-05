# CoTrack Ticket-System

Project and Team based Ticket-System using AdonisJs 4.1

## Version
0.9 BETA

## Languages
- German
- English (95% completed)

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
Edit your `.env` file to include the correct DB credentials.

### E-Mail setup
Edit your `.env` file to include the correct SMTP credentials.

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

### Log in as admin-user
- Username (E-Mail): info@codiac.ch
- Password: Nkz8289TMU

(You can change all informations later in your personal settings)

### General settings
On first login as admin you will be redirected to the general settings form. You have to fill in everything. There, among other things, you can change the default language. However, users can choose their own language in their own settings.

## API
There can be created Tickets from other Applications. As identifiers are used 3 fields:

### E-Mail
The JSON key `email` will be checked and assigned against a active user in the cotrack database.

### Project
The JSON key `project` will be checked and assigned against a existing and active project in the database. The request value will be matched
with the database field `id` in the `projects`-table.

### Token
The JSON key `token` will be checked against the deposited token in `.env` config file.

### Request format
```js
{
	"token": "xxxxxxxx",
	"subject": "The subject of the ticket",
	"description": "This is the description of the Ticket",
	"priority": "Normal or Hoch or Dringend",
	"email": "user@domain.com",
	"project": "xxx"
}
```

### API Url to create a ticket
https://yourdomain.com/api/public/tickets/create

---

# License
MIT License

Copyright (c) 2019 Omar De-Giuli [Custom Websolutions]

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

