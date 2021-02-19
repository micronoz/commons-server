curl -X POST \
-H "Content-Type: application/json" \
-H "Authorization: Bearer $1" \
-d '{"mutation": "{ createActivity(title: "hello") {id} }"}' \
"$2/graphql"