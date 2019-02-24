# Last Update

Query the last update time of the announcement list.

## Path

`/last-update`

## Interfaces

| URL            | Query String Parameters | Description            |
| -------------- | ----------------------- | ---------------------- |
| `/last-update` |                         | Last update date, etc. |

## Returns

### `/last-update`

Last update information, which has the following signature `LastUpdate`:

```TypeScript
type LastUpdate = {
  announcementCount: number
  date: number
}
```

See [types](#types) for more details about returned data.

### Types

#### `LastUpdate`

Last update information.

| Property          | Type     | Description                                         |
| ----------------- | -------  | --------------------------------------------------- |
| announcementCount | `number` | The number of announcements being updated last time |
| date              | `number` | Last update date (Unix timestamp)                   |

## Throws

No exceptions will be thrown if the database connection is good.