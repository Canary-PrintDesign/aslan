# Aslan Ventures INC
A website for Aslan Ventures INC, a landscaping company located in Parksville, BC

## Prerequisites

- [Node][Node1]
- [Gulp][Gulp1]
- [Hugo][Hugo1]

## Project Setup

##### Run Development Server
```
npm install
gulp¹
hugo server
```
1. DO THIS IN SEPARATE CONSOLE - Builds Gulp's SRC folder in to Hugo's Static folder

##### Build Project
```
gulp¹
hugo²
```
1. DO THIS IN SEPARATE CONSOLE
2. Builds to Public folder

##### Deploy Project
After Building project
```
gulp publish
```
Uses [AWS Publish][awspublish]


[Node1]: https://nodejs.org/en/
[Gulp1]: https://gulpjs.com/
[Hugo1]: https://gohugo.io/
[awspublish]: https://www.npmjs.com/package/gulp-awspublish
