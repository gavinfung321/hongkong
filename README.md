# Victoria Harbour

A night crossing of the harbour, drawn in the browser as you scroll.

[**Live site**](https://gavinfung321.github.io/hongkong/) · [**Source**](https://github.com/gavinfung321/hongkong) · [**Start here**](docs/plan/HANDOFF.md)

![Victoria Harbour at night, with the Clock Tower, a Star Ferry, red sails and the skyline](public/posters/harbour-social.jpg)

## What it does

- Moves the camera along the harbour as the page scrolls, through six chapters from dusk to the last light.
- Builds the water, the boats, the Clock Tower and the skyline in code.
- Lays the chapter words over the picture.
- Includes phones, reduced motion and a chapter menu.

## How it is made

Vite, vanilla JavaScript and Three.js. The scene is split across `src/`: one config for each chapter, and separate files for the world, the scroll and the interface. A push to `main` builds the site and publishes it.

## Run locally

From the project folder:

```bash
npm install
npm run dev
```

Then open <http://localhost:5173/>. Add `?debug` for the tuning tools, or `?fps` for the frame rate.

## Project structure

```text
index.html
src/
  data/          scroll numbers, the chapter list, world and atmosphere
  story/         one config per chapter
  scene/         the harbour, boats, skyline and light
  scroll/        scroll-to-camera
  ui/            the words, menu and footer
public/
  atmosphere/    clouds, mist, petals, foliage, fireworks
  plates/        the memory print, the two photographs, the ticket
  posters/       the share image and the two fallback stills
  fonts/         the web fonts and their licence files
docs/
  plan/          how we work, and the record of what is built
  SCENE-MAP.md   which files own each chapter
  FINAL-NARRATIVE-COPY.md
  ASSET-LEDGER.md
```

## Credit

The harbour, the boats and the skyline are original and built for this project. The fonts are used under the SIL Open Font License. The Dukling photograph is by Ank Kumar, CC BY-SA. The Kowloon terminus print, about 1915, is public domain.
