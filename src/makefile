.PHONY: all clean runserver upload

GAE_ACCOUNT = vit.sar68@gmail.com
PYTHON = C:\Python27\python.exe
APP_SERVER = $(PYTHON) "C:\Program Files\Google\google_appengine\dev_appserver.py" --enable_task_running=yes ./
APP_CFG = $(PYTHON) "C:\Program Files\Google\google_appengine\appcfg.py" --email=$(GAE_ACCOUNT)

DEL = rm

all: runserver

runserver:
	$(APP_SERVER)

upload:
	$(APP_CFG) $(APP) update ./
#	$(APP_CFG) $(APP) update_dos ./

clean:
	-$(DEL) *.pyc >nul
