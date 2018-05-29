import fetch from 'node-fetch'

export const schema = [
  `
  # A single news article from [https://reactjsnews.com/](https://reactjsnews.com/)
  type ReactJSNewsItem {
    # The news item's title
    title: String

    # A direct link URL to this news item on reactjsnews.com
    link: String

    # The name of the news item's author
    author: String
    # The name of the news item's create_at
    create_at: String

    # The date this news item was published
    pubDate: String

    # News article in HTML format
    content: String
  }
`
]

export const queries = [
  `
  # Retrieves the latest ReactJS News
  reactjsGetAllNews: [ReactJSNewsItem]
`
]

// React.js News Feed (RSS)
// const url =
//   'https://api.rss2json.com/v1/api.json' +
//   '?rss_url=https%3A%2F%2Freactjsnews.com%2Ffeed.xml'
const url =
  'https://cnodejs.org/api/v1/topics?page=1&limit=10&tab=all'

let items = []
let lastFetchTask
let lastFetchTime = new Date(1970, 0, 1)

export const resolvers = {
  RootQuery: {
    reactjsGetAllNews () {
      if (lastFetchTask) {
        return lastFetchTask
      }
      if (new Date() - lastFetchTime > 1000 * 60 * 10 /* 10 mins */) {
        lastFetchTime = new Date()
        lastFetchTask = fetch(url)
          .then(response => response.json())
          .then(data => {
            items = data.items
            if (data.success) {
              items = data.data
            }
            lastFetchTask = null
            return items
          })
          .catch(err => {
            lastFetchTask = null
            throw err
          })

        if (items.length) {
          return items
        }
        return lastFetchTask
      }
      return items
    }
  }
}
