# Occidental Dictionaries

This repository is an effort to liberate Occidental dictionary data from walled gardens.

Slowly but surely, we are gathering dictionary data from various sources and translating them to the open and free format of CSV.

If you'd like to create an HTML table, JSON file, or Excel sheet, just download the CSV and convert from there.

## Contributing to Dictionaries 

If you would like to add or edit rows to some dictionaries, simply:

1. Fork this repository

2. Make your changes on the appropriate CSV file located in the `data` folder

3. Submit a Pull Request back to this repository

The [website](http://occidental-lang.com/dictionaries) will automatically update along with the dictionaries because it dynamically pulls the CSVs every time it loads the page.

## Libraries Used

Special thanks to 

- Jets https://github.com/NeXTs/Jets.js
- Papa Parse https://github.com/mholt/PapaParse
- JQuery https://github.com/jquery/jquery

## Using the Template to create your own Dictionary search app

You can now generate your own Dictionaries Search App, using this one as a template. 

Just follow this link to begin: https://github.com/occidental-lang/dictionaries/generate

Things you'll want to do after generating from this template:

1. Add your own dictionary CSV files in the `data` folder

2. Delete the `unformatted` folder

3. Edit the README and index.html files for your own project info

- delete the google tag from the index.html file
- alter the html `button`s and `searchPlaceholder` variable to line up with how you named your dictionary files
