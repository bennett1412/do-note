# Guided Tutorial: Idiomatic Go CRUD REST API (with Gin & Postgres)

Welcome to Go! Since you already have solid programming experience, we can skip general coding basics and focus on the **pure, idiomatic Go way** of building services. 

Many developers coming from TypeScript, Java, or C# try to force a "layered architecture" (e.g., `controllers/`, `services/`, `repositories/`) onto Go. While that works, in Go it is generally considered over-engineered ("Java-style") and often leads to circular import cycles.

This guide outlines the idiomatic Go way to build a production-grade CRUD REST API.

---

## 1. Idiomatic Go Project Structure

In Go, we organize packages by **responsibility/domain**, not by technical layers. 

For a production-grade REST API, a clean and idiomatic structure looks like this:

```
go-api/
├── internal/
│   ├── config/
│   │   └── config.go    # Parses and holds configuration (env vars)
│   ├── database/
│   │   └── database.go  # Establishes Postgres pool (pgxpool)
│   └── note/
│       ├── note.go      # Domain models, input validation, and DB operations
│       └── handler.go   # HTTP routes and Gin request/response handling
├── .env                 # Environment variables
├── go.mod               # Go module settings
├── go.sum               # Go dependency checksums
└── main.go              # Entrypoint (wires everything up and starts server)
```

### Why this structure?
1. **Cohesion**: All code related to `notes` (the database queries, the JSON structs, the HTTP routes, and the validation) lives in `internal/note`. If you need to add a field to a note, you only modify files in this single folder.
2. **No Circular Imports**: Go forbids package `A` importing `B` if `B` imports `A`. Keeping a domain component together completely eliminates circular imports.
3. **Encapsulation**: Go uses capitalization for visibility. Capitalized names (e.g., `Note`) are exported (public); lowercase names (e.g., `dbField`) are unexported (package-private).

---

## 2. Core Go Principles applied to REST APIs

### A. Accept Interfaces, Return Structs
In Go, we don't write interfaces beforehand "just in case." We start with concrete structs. If another package needs to mock or abstract our database operations, *that* package defines the interface it requires.
```go
// We define a concrete Store struct for DB operations
type Store struct {
    db *pgxpool.Pool
}

func NewStore(db *pgxpool.Pool) *Store {
    return &Store{db: db}
}
```

### B. Explicit Dependency Injection (No Magic)
There is no reflection-based DI framework (like NestJS/Inversify). We pass dependencies explicitly via constructors:
1. `main.go` connects to the DB and gets a connection pool (`*pgxpool.Pool`).
2. We create the `Store`: `store := note.NewStore(dbPool)`.
3. We create the `Handler`: `handler := note.NewHandler(store)`.
4. We register the routes: `handler.RegisterRoutes(router)`.

### C. Explicit Context (`context.Context`)
Any operation that performs I/O (network requests, DB queries) must take a `context.Context` as its first parameter. This allows the application to cancel active DB queries if the client disconnects or if a request times out.
```go
func (s *Store) Get(ctx context.Context, id string) (*Note, error)
```

### D. Return Errors as Values
We do not use panics for control flow. Functions return both a result and an `error`. The caller must handle the error:
```go
note, err := store.Get(ctx, id)
if err != nil {
    if errors.Is(err, pgx.ErrNoRows) {
        c.JSON(http.StatusNotFound, gin.H{"error": "note not found"})
        return
    }
    c.JSON(http.StatusInternalServerError, gin.H{"error": "database error"})
    return
}
```

---

## 3. Let's Build Phase 1: Docker & Dependencies

Let's set up the database and project dependencies. 

### Step 1.1: Local Postgres with Docker Compose
We will create a lightweight local Postgres service. Open your root [docker-compose.yml](file:///c:/boringStuff/do-note-ts/docker-compose.yml) and write:

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:16-alpine
    container_name: donote_db
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
      POSTGRES_DB: donote
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

Create a [.env](file:///c:/boringStuff/do-note-ts/apps/go-api/.env) file under `apps/go-api/` to hold environment variables:
```env
PORT=8080
DATABASE_URL=postgres://postgres:password@localhost:5432/donote?sslmode=disable
```

### Step 1.2: Install pgx & godotenv
In your terminal, navigate to `apps/go-api` and run:
```powershell
go get github.com/jackc/pgx/v5
go get github.com/jackc/pgx/v5/pgxpool
go get github.com/joho/godotenv
```

---

## 4. What's Next?
Once you have Docker started and dependencies installed, we will write:
1. **Config Loader**: `internal/config/config.go`
2. **Database Connector**: `internal/database/database.go`

Let me know if you would like me to set up these connection skeletons for you to inspect, or if you want to write them yourself!
