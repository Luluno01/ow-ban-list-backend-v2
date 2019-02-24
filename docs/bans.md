# Ban

Populate ban blocks. There are two usages of this API.

1. Query the ban blocks of a specific announcement.
2. Retrieve a ban block with specific ID.

## Path

`/bans`

## Interfaces

| URL         | Query String Parameters | Description                                         |
| ----------- | ----------------------- | --------------------------------------------------- |
| `/bans`     | `search: string[]`      | Search for ban blocks containing specific key words |
| `/bans/:id` |                         | Get detailed information of a specific announcement |

Where

* `id` is a positive integer represents ban block id;
* `search` is the searching key words (of course you will need to stringify the key word array before appending it to the URL). e.g. `/ban?search=["black","aimbot"]`. Note that the key words array must be non-empty and every element in the array should be an non-empty and non-blank string.

## Returns

### `/bans`

Meta information of ban blocks whose Battle Tags match one or more key words, which has the following signature `BanBlockQueryResult`:

```TypeScript
type BanBlockMeta = {
  id: number
  annId: number
}

type BanBlockQueryResult = BanBlockMeta[]
```

Note that the number of query results is limited to 100 since a number of query result greater than 10 is unusual, not to mention 100 matched results.

See [types](#types) for more details about returned data.

### `/bans/:id`

Ban block with specified `id`, which has the following signature `BanBlock`:

```TypeScript
type BanBlock = {
  id: number
  header: string
  battleTags: string[]
  annId: number
}
```

See [types](#types) for more details about returned data.

For the second usage, this API returns the desired ban block, which if of type `BanBlock`.

### Types

#### `BanBlockMeta`

Ban block meta information.

| Property   | Type       | Description             |
| ---------- | ---------  | ----------------------- |
| id         | `number`   | Ban block ID            |
| annId      | `number`   | Parent announcement ID  |

#### `BanBlockQueryResult`

Ban block query result. Simply equivalent to `BanBlockMeta[]`.

#### `BanBlock`

Ban block.

| Property   | Type       | Description             |
| ---------- | ---------  | ----------------------- |
| id         | `number`   | Ban block ID            |
| header     | `string`   | Header of the ban block |
| battleTags | `string[]` | Banned battle tags      |
| annId      | `number`   | Parent announcement ID  |

## Throws

| Status Code | Description                                         |
| ----------- | --------------------------------------------------- |
| 400         | Invalid ban block ID or invalid searching key words |
| 404         | Specified ban block ID not found                    |

No other exceptions will be thrown if the database connection is good.