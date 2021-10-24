# SpotJobs API

This is repo for SpotJobs API.

## Clone

To clone this repo with submodules add parameter `--recurse-submodules` to your `git clone` command

## Develop

1. Run `cd dependencies && npm i && cd ..`
2. Run `npm run dev`. Serverless will run on port 8080.

## Init submodules
If you cloned the repo without `--recurse-submodules` parameter you need to init submodules

Run command `cd dependencies/nodejs/Constants/currency/spotJobs-country-currencies && git submodule init`

[More information about git submodules](https://git-scm.com/book/en/v2/Git-Tools-Submodules)
