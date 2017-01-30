var gulp = require("gulp");
var path = require("path");
var gutil = require("gulp-util");
var fs = require("fs");
var argv = require("minimist")(process.argv.slice(2));

var cwd = argv.cwd ? argv.cwd : process.env.INIT_CWD;

function Build() {
  this.cwd = cwd;
  this.env = "debug";
  this.solutionConfiguration = this.readConfigurationFile();
  this.frontendBuilder = this.solutionConfiguration.frontendBuilder.toLowerCase();
  this.AlwaysApplyName = this.solutionConfiguration.configurationTransform.AlwaysApplyName.toLowerCase();
  this.setActiveConfiguration();
}

Build.prototype.setActiveConfiguration = function () {
  for(var i = 0; i < this.solutionConfiguration.configs.length; i++) {
    if (this.solutionConfiguration.configs[i].name == this.env) {
        this.config = this.solutionConfiguration.configs[i];
        this.config.name = this.config.name.toLowerCase();
        return;
    }
  }
  throw "Cannot find environment configuration for " + this.env;
};

Build.prototype.setEnvironment = function (env) {
  if (typeof env !== "undefined") {
    this.env = env;
  }
  this.setActiveConfiguration();
  return this.env;
};

Build.prototype.readConfigurationFile = function () {
  var json = path.join(cwd, "solution-config.json");
  var pkg = JSON.parse(fs.readFileSync(json, "utf8"));
  return pkg;
};

Build.prototype.logEvent = function (type, message) {
  var msg;
  var args = Array.prototype.slice.call(arguments, 2);

  switch (type) {
    case "builder":
      msg = [gutil.colors.cyan("Builder:"), message];
    break;
    case "warning":
      msg = [gutil.colors.yellow("Warning:"), message];
    break;
    case "error":
      msg = [gutil.colors.red("Error:"), message];
    break;
    default:
      msg = [gutil.colors.magenta("Log:"), message];
    break;
  }

  gutil.log.apply(gutil, msg.concat(args));
};

var instance = new Build();
exports = module.exports = instance;