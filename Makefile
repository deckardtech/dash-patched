CYBORG_REPO=../cyborg-web-app
PATCHED_DASH_TABLE_DEPLOY_DIR=$(CYBORG_REPO)/src/dash_table_patched
build-dash-table:
	dash-update-components dash-table

deploy-patched-dash-table-to-cyborg-repo:
	rm -rf $(PATCHED_DASH_TABLE_DEPLOY_DIR)
	cp -r dash/dash_table $(PATCHED_DASH_TABLE_DEPLOY_DIR)
	sed -i 's/"name": "dash-table"/"name": "dash-table-patched"/' $(PATCHED_DASH_TABLE_DEPLOY_DIR)/package-info.json
	sed -i 's/window.dash_table=/window.dash_table_patched=/' $(PATCHED_DASH_TABLE_DEPLOY_DIR)/bundle.js

build-and-deploy-patched-dash-table-to-cyborg-repo: build-dash-table deploy-patched-dash-table-to-cyborg-repo
