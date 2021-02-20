curl -X POST \
-H "Content-Type: application/json" \
-H "Authorization: Bearer $1" \
-d '{"query": "{ activities {id} }"}' \
"$2/graphql"