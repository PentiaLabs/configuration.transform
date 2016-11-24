# configuration-transformer

> configuration-transformer for transforming sitecore configuration files in a helix setup

## usage
The module exports a gulp task called apply-xml-transform

import in gulpfile.js
```javascript
var package = require('@pentia/configuration-transformer')
```

use
```shell
gulp apply-xml-transform
```

### examples

#### specific environment
```shell
gulp apply-xml-transform --env debug
```
source file:
$solutionPath\src\project\website\web.debug.config

destination file:
$websiteRoot\web.config

#### sitecore file
```shell
gulp apply-xml-transform
```
source file:
$solutionPath\src\project\website\App_Config\include\Sitecore.Analytics.Reporting.debug.config

destination file:
$websiteRoot\App_Config\include\Sitecore.Analytics.Reporting.config

#### connection strings
```shell
gulp apply-xml-transform
```
source file:
$solutionPath\src\project\website\App_Config\Connectionstrings.debug.config

destination file:
$websiteRoot\App_Config\Connectionstrings.config

**Note:** 
The underlying mechanism for transforming files is the Microsoft configuration transformation : https://msdn.microsoft.com/en-us/library/dd465326(v=vs.110).aspx

## configuration files
### solution-config.json
Contains the environment specific paths for the packages to be installed to

```
{
    "configurationTransform": {
      "AlwaysApplyName": "always" //the name used to find files that should always be applied - ie. web.always.config
    },
    "msbuild": {
      "showError": false, //controls if errors should be shown in the output
      "showStandardOutput": false, //controls if the standard output of msbuild should be shown
      "toolsversion": 14.0, //controls the msbuild tool version
      "verbosity": "minimal" //sets the verbosity of the msbuild
    },
    "configs": [{ //is a array of the build configurations and their settings
        "name": "debug", //is the name of the configuration, this should match the name of the build configuration in visual studio
        "rootFolder": "C:\\websites\\pentia.boilerplate.local", 
        "websiteRoot": "C:\\websites\\pentia.boilerplate.local\\Website", //the path to root of the website - this is where the module will look for files to transform
        "websiteDataRoot": "C:\\websites\\pentia.boilerplate.local\\Website\\Data"
    }]
}
```

## Visual studio 
Use Slow cheetah to generate and preview the files inside visual studio.
It is recommeded to have the files you are targeting in your source to help with preview functionality in slow cheetah.