# Boosted ReVOLT! Software Tool

This repository contains the source code and downloadable executables for the Boosted ReVOLT! desktop software tool. The tool enables an end user to connect to a VESC and update VESC and/or ReVOLT! product settings.

It also provides firmware updates for Boosted ReVOLT! products.

![screenshot](./screenshots/home.png)

## Download
### Windows
You can download the latest installer in the [Releases](https://github.com/MichaelCastiau/boosted-revolt-tool/releases). Follow the installer
instructions. Windows will show a 'we protected your PC' dialog when running the tool 
for the first time. Click on 'more...' and 'Run Anyway' to run this tool.

### Mac
Download the latest `.dmg` package for mac from the [Releases](https://github.com/MichaelCastiau/boosted-revolt-tool/releases).

Just drag the program into  the Applications folder to install it.
When running the tool for the first time, Mac will show a warning this developer is unknown.

Go to 'System Preferences' > 'Security' and click on 'Open Anyway' to run the tool.

## Products
### Boosted ReVOLT! Dashboard

Available settings:
- metric system
- battery configuration

Firmware updates of the dashboard are made available through this tool.

## Contributing

This project uses Electron and Angular to build a cross-platform desktop application. Backend is running a Nodejs server with NestJs. To contribute, create a merge request and add @MichaelCastiau as reviewer.
