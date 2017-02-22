# np <no problem>

## Inroduction

**What is np?**

np is a php and javascript framework. It is designed for developing modern websites.

**Why should i use np?**

np is designed for webdevelopers. If you want to get results without coding alot
maybe np is your preferred framework.

With np you can split your work into backend and frontend development
for speeding up your progress.

## Documentation

the documentation is still under progress. After finishing it you will get informed as soon as possible.

## Requirements

np requires

- Apache webserver (newest version) with mods listed under section **Installation**
- MySQL Server (newest version)
- PHP 5.5.x (it is not compatible with php7)
- composer (newest version)

## Installation

1) Clone the np repository from github:

   - git clone https://github.com/Lightwight/np.git [DESTINATION_FOLDER]

   NOTE: After cloning ensure that your webserver has enough priveleges to read, write and execute files in your destination folder.

2) Install required external libraries via composer

   NOTE: If you don't have composer already installed please visit https://getcomposer.org/ for installation instructions.

   Switch to your desitnation folder and execute:

   - composer update

   All required libraries will be downloaded and installed to the 'vendor' folder.

3) Create a MySQL-Database:

   - create a database (collation utf8_general_ci) and user with all privileges with your preferred SQL-Client. 
   - import the install.sql from the 'install'-folder into your new database.

4) Setup your configuration:

   - rename the file 'config_install.php' into 'config.php'
   - open the file
   - assign all needed values to the variables described in there (i.e. database connection, captcha codes, and so on).