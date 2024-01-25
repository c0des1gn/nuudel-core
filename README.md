# nuudel-core

core components for nuudel

# git

git remote show origin
git branch -a
git checkout mui4
git checkout main
git checkout next11

git checkout -b <newbranch>
git push -u origin <newbranch>
git push --set-upstream <remote-name> <local-branch-name>
git fetch
git checkout origin/<branch>
git remote set-head origin <branch>
git branch --set-upstream-to=origin/<branch>
git pull origin <branch>
git fetch origin <branch>

git config --global push.default current

# npm

export NODE_AUTH_TOKEN=
npm login --registry=https://npm.pkg.github.com --scope=c0des1gn
npm login --registry=registry.npmjs.org
yarn
yarn build
npm publish --tag next11

# error fix

cd node_modules/node-sass && npm rebuild node-sass && cd ../..

# copy cli

npm install --global cpy-cli
