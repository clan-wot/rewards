import logging, json

from google.appengine.ext import webapp, db, blobstore
from google.appengine.ext.webapp import blobstore_handlers
#from google.appengine.api import taskqueue, users

import views

class UploadHandler(blobstore_handlers.BlobstoreUploadHandler):

    def post(self):
        try:
            upload_file = self.get_uploads('import')[0]
            views.data_import(json.load(blobstore.BlobReader(upload_file)))
            #taskqueue.add(url='/update/replay-view/%s' % replay_view_file, target='backend')
            blobstore.delete([upload_file.key()])
  
        except Exception, e:
            logging.error("upload Exception: %s" % e)

        self.redirect('/')

app = webapp.WSGIApplication([
    ('/edit/import/', UploadHandler)
    ], debug=True)
