# IGCommentPicker

Get all the comments from an Instagram post and place them into a CSV file. Helpful for influencers running a social media contest and need an automated way to copy all the comments.

## Why?

Instagram's API restricts it's use to only registered and verified applications and is difficult to get public data. By making HTTP requests to their GraphQL endpoint, data can be easily pulled and transformed to be made useful.

## Setup

To run locally, clone the project:

```
git clone https://github.com/kelvilee/IGCommentPicker.git
cd IGCommentPicker
```

Instagram requires a query_hash query parameter in order to make GraphQL requests.

### Get query_hash

1. Go to [https://www.instagram.com/github/](https://www.instagram.com/github/) and open the inspector `F12`.
2. Open the `Network` tab, refresh the page, and filter by `XHR`.
   ![Inspector](https://i.imgur.com/g4aU2zw.png)
3. You should see a `?query_hash=...` request being sent. Click on it and select the `Headers` tab. Scroll down to the bottom and under `Query String Parameters` is your query_hash
   ![Query_Hash](https://i.imgur.com/DY3KYhD.png)

### Setting `.env.local`

Create a `.env.local` file in the root directory of the project and add the `QUERY_HASH` environment variable using your query_hash

Example:

.env.local
`QUERY_HASH=15bf78a4ad24e33cbd838fdb41353ac1`

### Run local development server

Install dependencies with `yarn` and run the local development server

```
yarn
yarn dev
```

Enjoy!
