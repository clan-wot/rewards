.PHONY: all clean runserver upload

GAE_ACCOUNT = vit.sar68@gmail.com
PYTHON = C:\Python27\python.exe
APP_SERVER = $(PYTHON) "C:\Program Files\Google\google_appengine\dev_appserver.py" --enable_task_running=yes ./
APP_CFG = $(PYTHON) "C:\Program Files\Google\google_appengine\appcfg.py" --email=$(GAE_ACCOUNT)
GCLOUD = $(LOCALAPPDATA)\Application Data\Google\Cloud SDK\google-cloud-sdk\bin\gcloud.cmd

DEL = rm
PROJECT = spice-rewards
VERSION = appid

all: runserver

runserver:
	$(APP_SERVER)

upload:
	$(GCLOUD) app deploy --quiet --project $(PROJECT) -v $(VERSION) app.yaml backend.yaml cron.yaml index.yaml queue.yaml
#	$(APP_CFG) $(APP) update ./

clean:
	-$(DEL) *.pyc >nul
