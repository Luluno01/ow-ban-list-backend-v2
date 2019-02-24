# Announcement List

This API is used to index announcements or get the detail of a specific announcement.

## Path

`/announcements`

## Interfaces

| URL                       | Query String Parameters                     | Description                                         |
| ------------------------- | ------------------------------------------- | --------------------------------------------------- |
| `/announcements`          | `start?: number = 0`, `limit?: number = 10` | List announcement                                   |
| `/announcements/:id`      |                                             | Get detailed information of a specific announcement |
| `/announcements/:id/bans` | `start?: number = 0`, `limit?: number = 5`  | List the ban blocks for a specific announcement     |

Where

* `id` is a positive integer represents announcement ID;
* `start` is a non-negative integer indicates the index of the first returned announcement (for pagination), defaults to `0`;
* `limit` is a positive integer (no more than `20` in `/announcements` and no more than `10` in `/announcements/:id/bans`) indicates the maximum number of returned announcements (for pagination), defaults to `10` in `/announcements` and `5` in `/announcements/:id/bans`.

## Returns

### `/announcements`

Announcements meta information, which has the following signature `AnnouncementQueryResult`:

```TypeScript
type Announcement = {
  id: number
  name: string
  url: string
}

type AnnouncementQueryResult = {
  self: string
  data: Announcement[]
  count: number
  prev?: string
  next?: string
}
```

See [types](#types) for more details about returned data.

### `/announcements/:id`

Meta information of a single announcement with specified `id`, which has the signature `Announcement` as mentioned in [`/announcements`](#/announcements).

### `/announcements/:id/bans`

Ban blocks for the specified announcement, which has the following signature `BanBlockQueryResult`:

```TypeScript
type BanBlock = {
  id: number
  header: string
  battleTags: string[]
  annId: number
}

type BanBlockQueryResult = {
  self: string
  data: BanBlock[]
  count: number
  prev?: string
  next?: string
}
```

See [types](#types) for more details about returned data.

### Types

#### `Announcement`

Announcement meta information.

| Property | Type     | Description                                |
| -------- | -------  | ------------------------------------------ |
| id       | `number` | Announcement ID                            |
| name     | `string` | Name/title of the announcement             |
| url      | `string` | URL of the official announcement page      |
| date     | `number` | Announcement release date (Unix timestamp) |

#### `AnnouncementQueryResult`

Announcement list (not an array, though) returned by this API.

| Property  | Type                 | Description                                                                                          |
| --------- | -------------------- | ---------------------------------------------------------------------------------------------------- |
| data      | `Announcement[]`     | Array of announcement meta information containing no more than [`limit`](#interfaces) annoucement(s), in descending order by `Announcement.date` |
| count     | `number`             | The number of announcements can be queried in total                                                  |
| self      | `string`             | Query string for current page. e.g. `start=10&limit=10`                                              |
| prev      | `string?`            | Query string for previous page. e.g. `start=0&limit=10`. Undefined if no previous page exists.       |
| next      | `string?`            | Query string for next page. e.g. `start=20&limit=10`. Undefined if no next page exists.              |

## Throws

| Status Code | Reason                        |
| ----------- | ----------------------------- |
| 400         | Bad query parameter           |
| 404         | Nonexistent announcement `id` |

No other exceptions will be thrown if the database connection is good.