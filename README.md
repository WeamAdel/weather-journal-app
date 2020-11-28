# Weather-Journal App Project

## Contents

1. [Overview](#overview)
1. [Files Structure](#files-structure)
1. [Instructions](#instructions)

## Overview

An asynchronous web app that uses a Web API called [openWeathrMap](https://openweathermap.org/) to dynamically update the UI based on the user's entered data, it's the 2nd project task of **Udacity** _proffesional web development_ scholarship.

## Files Structure

- **server.js**: where you can find all of my server side logic using _node.js_.
- **src**: The client side website with all styles and scripts, there is no need to separate _.css_ and _.js_ files into separate files and assets as the project is small.
  - index.html
  - app.js
  - style.css
- README.md

## Instructions

- Users can find weather data by _zip code_ and _country code_.
- An error message shows with **404** status code if the entered _zip code_ or _country code_ is not valid by the [API](https://openweathermap.org/).
- The default location data is set to _Los Angeles, US_ with **zip code: 90001** and **country code: us**.
- Clicking the _😊_ in each entry card will show the user's entered feelings, as it may be too long, there is no need to show it all the time.
