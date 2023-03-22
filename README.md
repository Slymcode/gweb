# Greenlit Webapp and frontend

## Setup (1 time)
1. install nvm
2. install tig (a better git log)
3. add a .env file
4. copy the contents from .env.example to .env and add the missing parts

## Run locally
1. nvm use 16.18.0
2. npm install
3. npm start

## Development process
0. start on `main` branch. `git checkout main` and then `git pull`
1. `git checkout -b <name of feature or thing you are doing>` this is the short hand of: `git branch add-new-button` and `git checkout add-new-button`
2. make your code changes and add as many commits as you need (steps 4 and 5)
3. `git add --all`
4. `git commit -m "what you did"` (repeat this as many times as you need)
5. `git push origin HEAD`
6. open a pull request on github.com

Rebasing process (if you're on a branch and main has changed and you want to merge - to test if your changes will conflict with what exists already (what has been deployed))

5. git fetch --all
6. git rebase origin/main (if there is a conflict try to use git rebase --continue and it will autoresolve if there are no file conflicts. If there are file conflicts try to reconsole or use git rebase --skip)
7. TEST your branch make sure everything works still. You bascially have put other people's changes in your branch.
7. git push origin HEAD or git push --force (and then follow the prompt)
8. on the pull request wait for approval (ping people) and use squash and merge feature to keep main linear.


### Notes
Add to package.json maybe if it does not connect to backend
https://stackoverflow.com/questions/69719601/getting-error-digital-envelope-routines-reason-unsupported-code-err-oss
```
"proxy": "http://localhost:3001"
```

https://www.freecodecamp.org/news/how-to-create-a-react-app-with-a-node-backend-the-complete-guide/
