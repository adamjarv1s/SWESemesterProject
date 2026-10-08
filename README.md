# Uter-US - Full Stack Period Tracker App
Many of the period tracker apps, 
and especially the most popular period tracker apps on the app store right now 
are intrusive in terms of notifications, 
connected to an outside server and collect data, 
and also sell that data to third parties. 
This is undesirable.

We will create a completely locally run on your device period tracker app 
that is nonintrusive, customizable, and fun to use 
so that it encourages users to report their symptoms.

## Tech Stack
### Frontend
- React
- Express

### Backend
- C++
- MariaDB

## Viewing Designs via Figma
- [Figma](https://www.figma.com/design/Dgkb2VfXTq9qRCwfa5NQ9X/UterUs-Main-Designs?node-id=7-6&t=mNrpzuBlpNFpYPjj-1) was used to create the designs for the project.
- Figma Password: uterus

## Setting up Frontend
To set up frontend, do the following commands in your terminal:
### Navigate to uter-us Folder
```bash
cd uter-us-frontend
```
### Install Dependencies
```bash
npm install
```
### Run React Application
```bash
npx expo start
```

## Setting up backend
First open Visual Studio Code and install the following extensions: 

C/C++ Dev Tools, C/C++ Extension Pack, C/C++ Themes, CMake, CMake Tools, Database Client, Database JDBC, SQLTools, SQLTools MySQL/MariaDB/TiDB, C/C++ 

Navigate to the Database Tab and create a Connection with the following parameters: 

- Name: uterusdata 
- Connect Using: Server and Port 
- Address: localhost 
- Port: 3306 
- Database: uterusdata 
- Username: root 
- Password Mode: Ask on Connect 
- Authentication Protocol: default 
- SSL: Disabled 
- Over SSH: Disabled 
- Show records default limit: 50 

Next, connect to the server with the following parameters: 

- Host: 127.0.0.1 
- Username: root 
- Database: uterusdata 
- Port: 3306 
- Password: Anything (remember it though) 

Then click connect to server. 

Next open up Commandline or Powershell and run the following commands: 

cd into the project directory

```
cd uter-us-frontend 
npm install 
npx expo start
```
Next, hit the W key to open the app in your browser, then if desired, hit ctrl + shift + J to open developer tools and set it to mobile to look better on a computer screen. 

If preferred, there are [Video Instructions For Backend Setup](https://youtu.be/cgrKe4JIC3Y)
