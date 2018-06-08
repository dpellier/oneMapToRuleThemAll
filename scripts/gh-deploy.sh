#!/usr/bin/env bash
branch=$(git branch | sed -n -e 's/^\* \(.*\)/\1/p')

echo ""
echo "##-- Get last remote sources from $branch --##"

git fetch
git rebase $branch

echo ""
echo "##-- Building last sources from $branch --##"

npm run build

echo ""
echo "##-- Deploying on Github Pages --##"

git branch --delete --force gh-pages
git checkout --orphan gh-pages
git add -f dist
git commit -m "Rebuild GitHub pages"
git filter-branch -f --prune-empty --subdirectory-filter dist && git push -f origin gh-pages && git checkout -
git checkout $branch
