If you want to run or build this web project

ensure that the nodejs environment is installed

then run `code ./solidui-web` and `yarn install` or `npm install`,

then create `.evn.dev` and `.env.prod` file in the `solidui-web`folder

The basic contents are as follows

```shell
# .env.prod
NODE_ENV=production

BASE_ENV=""
```

```shell
# .env.dev
NODE_ENV=development

BASE_ENV=""
# proxy address，
# If solidui server is running locally: http://localhost:12345
PROXY_SERVER=http://*********:***
# local serve port
SERVER_PORT=3000

```

