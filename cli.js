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

  // Modify src/index.css to import Tailwind CSS
  const indexCssPath = `${appDirectory}/src/index.css`;
  if (existsSync(indexCssPath)) {
    writeFileSync(indexCssPath, `@import "tailwindcss";\n`);
    console.log(chalk.green("✓ Modified: src/index.css"));
  } else {
    console.log(
      chalk.yellow(
        "Warning: src/index.css not found. Please make sure it exists."
      )
    );
  }

  // Install Tailwind CSS as a Vite plugin
  console.log(chalk.green("Installing Tailwind CSS with Vite plugin"));
  exec(`cd ${appDirectory} && npm install tailwindcss @tailwindcss/vite`);

  // Modify vite.config.js to include Tailwind CSS plugin
  const viteConfigPath = `${appDirectory}/vite.config.js`;
  if (existsSync(viteConfigPath)) {
    writeFileSync(
      viteConfigPath,
      `import { defineConfig } from 'vite';\nimport tailwindcss from '@tailwindcss/vite';\n\nexport default defineConfig({\n  plugins: [\n    tailwindcss(),\n  ],\n});`
    );
    console.log(chalk.green("✓ Modified: vite.config.js"));
  } else {
    console.log(
      chalk.yellow(
        "Warning: vite.config.js not found. Please make sure it exists."
      )
    );
  }

  console.log(chalk.green("✓ Running Vite"));
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
