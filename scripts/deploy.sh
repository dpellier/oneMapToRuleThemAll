#!/usr/bin/env bash

# Argument checking

if [ $# -eq 0 ]
then
    echo ""
    echo "usage: deploy.sh <version>"
    echo ""
    echo "Version can be:"
    echo "    major   use this for breaking changes        (1.0.0 => 2.0.0)"
    echo "    minor   Use this for functionality upgrades  (1.0.0 => 1.1.0)"
    echo "    patch   Use this for minor fixes             (1.0.0 => 1.0.1)"
    echo ""
    exit 0
fi

if [ $1 != "major" ] && [ $1 != "minor" ] && [ $1 != "patch" ]
then
    echo ""
    echo "Version should be one of: major, minor or patch"
    echo ""
    exit 0
fi

# Git checking

if [ "$(git rev-parse --abbrev-ref HEAD)" != "master" ]
then
  echo ""
  echo "You can only deploy when on the master branch, please move to it"
  echo ""
  exit 0
fi

if [ ! -z "$(git status --porcelain)" ]
then
  echo ""
  echo "You have still some changes to commit, please commit or stash them before continuing"
  echo ""
  exit 0
fi

echo ""
echo "##-- Get last remote sources --##"
git fetch
git rebase origin/master

# Building resources

npm run build

# Deploying as git tag on Github

echo ""
echo "##-- Upgrading Project version --##"
TAG=`npm --no-git-tag-version version $1`

git add package.json
git commit -m "release(app): release new version ${TAG}"
git push origin master

echo ""
echo "##-- Deploying on Github tag --##"
git add -f dist

git commit -m "release(app): generate files for version ${TAG}"
git tag ${TAG}

git push origin ${TAG}
git reset --hard HEAD~1
