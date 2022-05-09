# Overview

This branch is based on v.2.3.1 tag

It patched the dash-table module with following:

1) tooltip_conditional bug - https://github.com/plotly/dash-table/issues/917.
The fix is based on https://github.com/plotly/dash-table/pull/906/files
2) case-insensitive filter bug - https://github.com/plotly/dash-table/issues/934,
The fix is based on https://github.com/plotly/dash-table/pull/935/files

# Setup
You have to first follow the steps in the CONTRIBUTING.md to setup the venv, install the npm depencies
and run the initial build.

# How to test code change to dash-table ReactJS component quickly 
```
cd components/dash-table; npm run build.watch
```
It will use webpack dev server to serve a simple test app in components/dash-table/demo/App.ts which uses
the dash-table ReactJS component (no Python code involved)

# How to deploy the patched dash-table component 
In cyborg, we install the dash package from pip registry and then replace the dash-table component by
the patched version built from this repo. So far this process is done manually as below.

1) make sure follow the initial setup and build step as described in the CONTRIBUTING.md
2) then run 'make build-and-deploy-patched-dash-table-to-cyborg-repo'
 notice this make target assume cyborg-web-app repo locates at ../cyborg-web-app
  it will do following steps
   * run `update-dash-component dash-table`
   * clear <path_to_cyborg_repo>/src/dash_table_patched folder 
   * copy the artifacts from dash/dash_table to <path_to_cyborg_repo>/src/dash_table_patched folder
   * update the name attribute in <path_to_cyborg_repo>/src/dash_table_patched/package-info.json to
    'dash-table-patched'. This value will be used in Python side to identify the JS package
   * update the <path_to_cyborg_repo>/src/dash_table_patched/bundle.js, change
    window.dash_table=l to window.dash_table_patched=l 
   * update the <path_to_cyborg_repo>/src/dash_table_patched/DataTable.py, change
    self._namespace = 'dash_table_patched'
   * update the <path_to_cyborg_repo>/src/dash_table_patched/__init__.py, change
   "namespace": "dash" to "namespace": package_name
   "relative_package_path": "dash_table/xxx" to "relative_package_path": "xxx"
   
For cyborg to use this patched dash-table, it will do following two things
 * In src/cybrog_web_app/__init__.py, add code to add src folder to the front of the sys.path
 * Wherever we need to use the patched version of the dash-table, we should use 'import dash_table_patched'
instead of 'import dash_table' 

# About build configuration
