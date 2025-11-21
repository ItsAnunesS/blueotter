## Backend Challenge

The challenge is to develop a solution that allows interacting with and manipulating GitHub user data.

### Endpoint 1

Copies all public repositories of a given GitHub user into a local database. The endpoint must receive the username as a parameter. The following data must be stored:

- Repository ID
- Repository name
- Description
- URL
- Main language
- Repository creation date
- User ID
- User login
- User avatar

### Endpoint 2

Receives a GitHub username and lists all repositories stored in the local database for that user. The following data must be returned:

- Repository ID
- Repository name
- Description
- URL
- Main language
- Repository creation date

### Endpoint 3

Searches for repositories stored in the local database. It receives as a parameter the keywords to be matched against repository data.

### Endpoint 4

Returns statistics computed only from already synchronized local data (from Endpoint 1).

#### Query parameters:

- user (optional): login
  - Not provided → global statistics (all saved users)
  - Provided → statistics only for that user

- topN (optional, default 5, max 20): ranking size

#### Example return:

- summary:
  - total_repos
  - total_users (only for global mode)

- languages: languages ranked by number of repositories
- top_users_by_repos: only in global mode; users with the most repositories (top N)
- timeline_created_monthly: histogram of repositories created by month

---

### GitHub API Endpoints

- Repositories: GET [https://api.github.com/users/{user}/repos](https://api.github.com/users/{user}/repos)
- Users: GET [https://api.github.com/users/{user}](https://api.github.com/users/{user})

---

### Additional Notes

The solution should preferably be developed in Node.js using TypeScript and NestJS (or a similar framework).

Including Docker or Docker Compose configuration to run the application is a bonus.
