# ow-ban-list-backend-v2

Get the ban list from Overwatch BBS (China). Version 2.

## Requirements

* `Node.js` runtime environment (`10.x` or above);
* `npm` or other functionally equivalent package manager (used to install dependencies and build). `npm5` is recommended;
* `PostgreSQL` (used to store the ban list).

## APIs

* [`announcements`](https://github.com/Luluno01/ow-ban-list-backend-v2/blob/master/docs/annoucements.md)
* [`ban`](https://github.com/Luluno01/ow-ban-list-backend-v2/blob/master/docs/bans.md)
* [`last-update`](https://github.com/Luluno01/ow-ban-list-backend-v2/blob/master/docs/last-update.md)

## Development and Deploy

### Clone

To continue develop and/or deploy this project, first you need to clone this repository to you local workspace.

```bash
git clone https://github.com/Luluno01/ow-ban-list-backend-v2.git --depth=1 --recursive
```

Then you will need to install dependencies using `npm` **inside** the cloned repository directory.

```bash
npm install
```

### Deploy a PostgreSQL Database

There are many ways to deploy a PostgreSQL database. You can

* install a PostgreSQL database instance on your cloud server or your local PC, or
* deploy a PostgreSQL container on the cloud, or
* deploy a PostgreSQL database instance on [ElephantSQL](https://www.elephantsql.com/),
which provides 20 MB data capacity and 5 concurrent connections for free (personally recommended for development usage)

After deploy your PostgreSQL database, you shall have a database connection URL, which looks like

> postgres://username:password@database.host.com:5432/database_name

If your database service provider doesn't provide you a connection URL, you can simply construct one.

Then you need to set a environment variable `DB_URL` to the connection URL in your workspace.

```bash
set DB_URL=<your connection URL>
```

### Build

If it is the first time you build the cloned repository, you should run

```bash
npm run buildAll
```

*(By running the above command, you will have the submodule [ow-ban-list](https://github.com/Luluno01/ow-ban-list) built together with this server.)*

Otherwise

```bash
npm run build
```

### Synchronize Database

Note that you need a `DB_URL` environment set to a PostgreSQL connection URL for this step.

By executing the following command, you will fetch all the ban announcements from Overwatch BBS (China) into your database (old tables will be **dropped** and re-created).

```bash
npm run sync
```

If no changes are made to the database schemas, you will not need to execute this command a second time.
However, everytime you move to a new database instance or change the database schema, you should synchronize the database again.

### Running the Server

Note that you need a `DB_URL` environment variable set to a PostgreSQL connection URL for this step.

Simply run

```bash
npm run serve
```

Then you can access the APIs via `http://localhost:3000/` (the server listens to the port 3000 by default). Of course you need to build and synchronize database at least once before running the server.

### Update Announcements List

Note that you need a `DB_URL` environment variable set to a PostgreSQL connection URL for this step.

Simply run

```bash
npm run update
```

By running the above command, new announcements and their ban blocks will be fetched into database.

You can add a cron job to update announcements list everyday automatically. I personally recommended update the list twice a day.

## Configuration

The configuration files are `config.json`, `log4js.json` and `sequelize.config.js`. Plus, the environment variable `CORS` is used to set valid origin(s) for cross-origin request.

### `config.json`

Configuration of the application.

| Property | Type     | Description           |
| -------- | -------- | --------------------- |
| port     | `number` | Server listening port |

### `log4js.json`

Configuration for `log4js`. Do not modify this file unless you know exactly what you are doing. See [`log4js`](https://www.npmjs.com/package/log4js) for more details about this configuration.

### `sequelize.config.js`

Configuration for `Sequelize`. See [`Sequelize`](http://docs.sequelizejs.com/) for more details about this configuration.

### `CORS`

This is an environment variable used to set valid origin(s) for cross-origin request. For example, `CORS=http://example.com,http://example.org` will set `Access-Control-Allow-Origin` and `Access-Control-Allow-Credentials` HTTP headers for the origins `http://example.com` and `http://example.org` so that responses to the requests from these two origins will not be blocked by the browser's CORS policy.