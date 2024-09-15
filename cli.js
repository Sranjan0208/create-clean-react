#!/usr/bin/env node

import pkg from "shelljs";
import { existsSync, unlinkSync, writeFileSync } from "fs";
import inquirer from "inquirer";
import chalk from "chalk";

const { exec } = pkg;

function createReactApp(appName, language) {
  const template = language === "TypeScript" ? "react-ts" : "react";
  exec(`npm create vite@latest ${appName} -- --template ${template}`);
  console.log(chalk.green(`✓ Created React app with ${language}: ${appName}`));
}

function cleanReactApp(appName) {
  const appDirectory = `${process.cwd()}/${appName}`;

  console.log(chalk.green(`✓ Changed directory to ${appDirectory}`));

  // List of files/folders to remove
  const filesToRemove = ["src/assets/react.svg", "public/vite.svg"];

  filesToRemove.forEach((file) => {
    const filePath = `${appDirectory}/${file}`;
    if (existsSync(filePath)) {
      unlinkSync(filePath);
      console.log(chalk.green(`✓ Removed ${filePath}`));
    }
  });

  // Modify src/App.jsx or src/App.tsx based on language
  const appJsPath = `${appDirectory}/src/App.${existsSync(`${appDirectory}/src/App.tsx`) ? 'tsx' : 'jsx'}`;
  if (existsSync(appJsPath)) {
    writeFileSync(
      appJsPath,
      'import React from "react";\n\nconst App = () => {\n  return <div className="text-xl font-bold underline">I am the Honored One!!</div>;\n}\n\nexport default App;\n'
    );
    console.log(chalk.green(`✓ Modified: ${appJsPath}`));
  } else {
    console.log(
      chalk.yellow(
        `Warning: ${appJsPath} not found. Please make sure it exists.`
      )
    );
  }

  // Modify src/App.css to remove default content
  const appCssPath = `${appDirectory}/src/App.css`;
  if (existsSync(appCssPath)) {
    writeFileSync(appCssPath, "");
    console.log(chalk.green("✓ Cleared: src/App.css"));
  } else {
    console.log(
      chalk.yellow(
        "Warning: src/App.css not found. Please make sure it exists."
      )
    );
  }

  // Modify src/index.css to remove default content
  const indexCssPath = `${appDirectory}/src/index.css`;
  if (existsSync(indexCssPath)) {
    writeFileSync(
      indexCssPath,
      `@tailwind base;\n@tailwind components;\n@tailwind utilities;\n`
    );
    console.log(chalk.green("✓ Modified: src/index.css"));
  } else {
    console.log(
      chalk.yellow(
        "Warning: src/index.css not found. Please make sure it exists."
      )
    );
  }

  // install tailwind css
  console.log(chalk.green("Installing and Initializing Tailwind CSS"));
  exec(`cd ${appDirectory} && npm install -D tailwindcss postcss autoprefixer`);

  // Initialize Tailwind CSS
  exec(`cd ${appDirectory} && npx tailwindcss init -p`);
  console.log(chalk.green("✓ Installed and Initialized Tailwind CSS"));

  // Modify tailwind.config.js
  const tailwindConfigPath = `${appDirectory}/tailwind.config.js`;
  if (existsSync(tailwindConfigPath)) {
    writeFileSync(
      tailwindConfigPath,
      `/** @type {import('tailwindcss').Config} */\n export default { \n content: ["./index.html","./src/**/*.{js,ts,jsx,tsx}",],\n theme:{\n extend: {},\n },\n plugins: [],\n};`
    );
    console.log(chalk.green("✓ Modified: tailwind.config.js"));
  } else {
    console.log(
      chalk.yellow(
        "Warning: tailwind.config.js not found. Please make sure it exists."
      )
    );
  }

  console.log(chalk.green("✓ Running vite"));
  exec(`cd ${appDirectory} && npm install && npm run dev`);
}

function init() {
  inquirer
    .prompt([
      {
        type: "input",
        name: "appName",
        message: "Enter the name of your React app:",
      },
      {
        type: "list",
        name: "language",
        message: "Select the language you want to use:",
        choices: ["JavaScript", "TypeScript"],
      },
    ])
    .then((answers) => {
      const { appName, language } = answers;
      createReactApp(appName, language);
      cleanReactApp(appName);
      console.log(
        chalk.green(`Successfully created a clean React app: ${appName}`)
      );
    });
}

init();
