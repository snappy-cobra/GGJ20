# GGJ20

This repository contains the sources to the [Global Game Jam](http://globalgamejam.org) in Groningen, 31 January to 2 February 2020.

## :briefcase: Development
I (Luc) have some opinions on how to work on a project when it regards to git and programming, the text below puts some of these opinions in writing. I'm open to alternative methods, so please contact me if you disagree with anything here :).

### Code style
The prettier your code, the better you can read it afterwards. It will also help you get help from others if things don't work out. Please:

- Think before you write! There are many [design patterns](https://gameprogrammingpatterns.com/) and architectural styles to use for most common patterns.
- Don't feel afraid to consult other developers.
- Use proper naming (I prefer longer descriptive names to short obsucre ones).
- Keep the project organised (use folders and proper file names when logical, and adhere to your structure).
- Keep classes, methods and such tiny and cute.

Most important of all: _try to be empathetic to your co-developers!_ We're all trying to create something nice here :).

### Git workflow
The repository is organised in two main branches:

- **master**: this branch features stable releases, ready for players.
- **develop**: this branch should be as stable as possible, all intermediate releases are merged here.

You should **branch from develop** if you are planning to implement a new feature, and merge back into develop once this feature is completed (after which you should be able to delete this feature branch). You can name these branches `feature\thing_you_implement`. 

Please do not commit broken code to develop to the best of your ability, you will halt other developers in their progress.

Commits should be descriptive about the changes, it helps you find stuff you lost (or track down bugs you missed).

As a side note, be sure to only push source and assets to this repository, keep the camp cleaner than you left it ;).

## Building
Building and testing is achieved through simple commands. Before you do anything however, make sure you have `npm` installed. Then run `npm install` in this repository and you should be fine.

- **Building** : `npm run build`
- **Testing** : `npm run test`

## Authors
- [Timo Strating](https://github.com/timostrating)
- [Michiel de Jong](https://troido.nl)
- [Thijs van der Knaap](https://github.com/Gezzellig)
- [Luc van den Brand](LucvandenBrand.com)