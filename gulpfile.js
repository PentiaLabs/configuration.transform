/*jslint node: true */
"use strict";

var gulp = require("gulp");
var nopt = require("nopt");
var path = require("path");
var requireDir = require("require-dir");
var build = require("./build.js");
var config = build.config;
var foreach = require("gulp-foreach");
var msbuild = require("gulp-msbuild");

var args = nopt({
  "env"     : [String, null]
});

build.setEnvironment(args.env);

gulp.task("apply-xml-transform", function () {
  var layerPathFilters = [
  "./src/Foundation/**/*."+build.AlwaysApplyName+".config",
  "./src/Feature/**/*."+build.AlwaysApplyName+".config",
  "./src/Context/**/*."+build.AlwaysApplyName+".config",
  "./src/Project/**/*."+build.AlwaysApplyName+".config",
  "./src/Foundation/**/*."+build.AlwaysApplyName.toLowerCase()+".config",
  "./src/Feature/**/*."+build.AlwaysApplyName.toLowerCase()+".config",
  "./src/Context/**/*."+build.AlwaysApplyName.toLowerCase()+".config",
  "./src/Project/**/*."+build.AlwaysApplyName.toLowerCase()+".config",
  "./src/Foundation/**/*."+build.config.name+".config", 
  "./src/Feature/**/*."+build.config.name+".config", 
  "./src/Context/**/*."+build.config.name+".config", 
  "./src/Project/**/*."+build.config.name+".config", 
  "./src/Foundation/**/*."+build.config.name.toLowerCase()+".config", 
  "./src/Feature/**/*."+build.config.name.toLowerCase()+".config", 
  "./src/Context/**/*."+build.config.name.toLowerCase()+".config", 
  "./src/Project/**/*."+build.config.name.toLowerCase()+".config", 
  "!./src/**/obj/**/*.config", 
  "!./src/**/bin/**/*.config",
  "!./src/**/output/**/*.config"];

  return gulp.src(layerPathFilters)
    .pipe(foreach(function (stream, file) {
      var filePath = file.path.toLowerCase();
      if(filePath.indexOf("web."+build.config.name.toLowerCase()+".config") == -1 && filePath.indexOf("web."+build.AlwaysApplyName.toLowerCase()+".config") == -1)
      {
          var fileToTransform = filePath.slice(filePath.indexOf("app_config"))
          
          if (filePath.indexOf(build.config.name) != -1)
          {
            var fileToTransform = fileToTransform.replace("."+build.config.name.toLowerCase(),"");
          }
          else
          {
            var fileToTransform = fileToTransform.replace("."+build.AlwaysApplyName.toLowerCase(),"");
          }
      }
      else
      {
        var fileToTransform = "web.config";
      }

      var dest = build.config.websiteRoot;
      if(!path.isAbsolute(dest))
      {
        dest = path.join(process.cwd(),dest);
      }

      console.log("Applying configuration transform: " + filePath);
      console.log("To destination file:            " + dest + "\\" + fileToTransform)
      return gulp.src("./node_modules/@pentia/configuration-transformer/applytransform.targets")
        .pipe(msbuild({
          targets: ["ApplyTransform"],
          configuration: build.config.name,
          logCommand: false,
          stderr: build.solutionConfiguration.msbuild.showError,
          stdout: build.solutionConfiguration.msbuild.showStandardOutput,
          verbosity: build.solutionConfiguration.msbuild.verbosity,
          maxcpucount: 0,
          toolsVersion: build.solutionConfiguration.msbuild.toolsversion,
          properties: {
            WebConfigToTransform: dest,
            TransformFile: filePath,
            FileToTransform: fileToTransform
          }
        }));
    }));
});

gulp.task("default", function () {
	console.log("You need to specifiy a task.");
});

