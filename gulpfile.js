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
  "./src/Foundation/**/*"+build.AlwaysApplyName+".config",
  "./src/Feature/**/*"+build.AlwaysApplyName+".config",
  "./src/Context/**/*"+build.AlwaysApplyName+".config",
  "./src/Foundation/**/*"+build.config.name+".config", 
  "./src/Feature/**/*"+build.config.name+".config", 
  "./src/Context/**/*"+build.config.name+".config", 
  "!./src/**/obj/**/*.transform", 
  "!./src/**/bin/**/*.transform",
  "!./src/**/output/**/*.transform"];

  return gulp.src(layerPathFilters)
    .pipe(foreach(function (stream, file) {
      if(file.path.indexOf("web."+build.config.name+".config") == -1 && file.path.indexOf("web."+build.AlwaysApplyName+".config") == -1)
      {
          var fileToTransform = file.path.slice(file.path.indexOf("App_Config"))
          
          if (file.path.indexOf(build.config.name) != -1)
          {
            var fileToTransform = fileToTransform.replace("."+build.config.name,"");
          }
          else
          {
            var fileToTransform = fileToTransform.replace("."+build.AlwaysApplyName,"");
          }
      }
      else
      {
        var fileToTransform = "web.config";
      }

      console.log("Applying configuration transform: " + file.path);
      console.log("To destination file:            " + build.config.websiteRoot + "\\" + fileToTransform)
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
            WebConfigToTransform: build.config.websiteRoot,
            TransformFile: file.path,
            FileToTransform: fileToTransform
          }
        }));
    }));
});

gulp.task("default", function () {
	console.log("You need to specifiy a task.");
});

