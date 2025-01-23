# Customized Table

This project is a customizable table built with React.

## Live Demo

You can view the live demo of the project at the following URL:
[https://react-customized-table.netlify.app/](https://react-customized-table.netlify.app/)

## Features

- Column Group  ✅
- Row Group     ✅
- Pagination
- Sorting
- Filtering
- Add row
- Delete row
- Edit row
- Add column
- Delete column
- Edit column


## Installation

To install the project dependencies, run:

```sh
npm install


https://stackoverflow.com/questions/68733789/tabulator-update-one-cell-using-data-from-another-in-the-row
```

## Create a Netlify Function

To create a new Netlify function using the CLI, follow these steps:

1. **Install Netlify CLI** (if you haven't already):
   ```bash
   npm install -g netlify-cli
   ```

2. **Log in to Netlify**:
   ```bash
   netlify login
   ```

3. **Create a new function**:
   Navigate to your project directory and run:
   ```bash
   netlify functions:create
   ```
   Follow the prompts to name your function and choose the language (JavaScript or Go).

4. **Edit your function**:
   After creating the function, you can find it in the `netlify/functions` directory. Open the file and add your logic.

## Build Netlify Functions

To build all the Netlify functions in your project, use the following command:

```bash
netlify functions:build --src path/to/your/functions
```

```bash
netlify functions:build --src netlify/functions
```


### Description

This command compiles all the functions located in the directory specified in your `netlify.toml` file (usually `netlify/functions/`). Make sure to run this command from the root of your project where the `netlify.toml` file is located.

If you need to specify a different source folder for your functions, you can use the `--src` flag:

## Deploy to Netlify

To deploy your project to Netlify, use the following command:

```bash
netlify deploy --prod
```

### Description

This command deploys your project to the production environment on Netlify. Make sure you have set up your site on Netlify and have the necessary environment variables configured.

If you want to deploy to a draft URL instead, you can use:

```bash
netlify deploy
```

This will give you a preview link for your changes.


Add this is react app package.json if u want to run it locally
json-server": "json-server --watch ./data/table.json --port 3030",