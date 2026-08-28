````mermaid
flowchart TD

    client[Client / Next.js]
    api[Go API]
    pg[(Postgres)]

    rp[(Redpanda)]

    curator[Feed Poller Worker]
    parser[Feed Parser Worker]
    analytics[Analytics Worker]

    rss[External RSS Feeds]

    client <-->|CRUD + publish| api

    api <--> pg

    api -->|PostPublished event| rp

    curator -->|poll feeds| rss
    curator -->|FeedFetched event| rp

    rp --> parser
    parser -->|store normalized content| pg

    client -->|view article| api
    api -->|ArticleViewed event| rp

    rp --> analytics
    analytics -->|aggregate stats| pg ```
````
