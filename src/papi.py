"""
Example of python class for using Wargaming PublicAPI
(C) 2014 by Vitaly Bogomolov mail@vitaly-bogomolov.ru
special for https://github.com/OpenWGPAPI

based on: https://ru.wargaming.net/support/Knowledgebase/Article/View/713/25/primer-prkticheskogo-ispolzovnija-metodov-api-c-pltformnet

>>> import papi
>>> api = papi.Session(papi.Server.RU, 'demo')
>>> api.fetch('wot/account/list', 'search=%s&limit=1' % 'Serb')
[{u'nickname': u'SerB', u'id': None, u'account_id': 461}]
>>> api.isClanDeleted(90)
True
>>> api.isClanDeleted(1)
False
"""

import urllib2, json, logging, time

class Server:
  RU   = 'worldoftanks.ru'
  EU   = 'worldoftanks.eu'
  COM  = 'worldoftanks.com'
  SEA  = 'worldoftanks.asia'
  KR   = 'worldoftanks.kr'
  
class Error(Exception):
    pass

class Page(object):

    def __init__(self, url):

        self.url = url
        self.row_text = ''
        self.response_code = 0
        self.response_info = ()

        import random
        
        delim = '?'
        if delim in url:
            delim = '&'
        self.url = "%s%s%s" % (url, delim, str(random.random()))  
  
    def fetch(self, retries=5, delays=5):
  
        last_exception = None
        count = 0
        is_ok = False
      
        while (not is_ok) and (count < retries):
      
            try:
                response = urllib2.urlopen(self.url, None, 30)
                is_ok = True
            except Exception as e:
                last_exception = e
                count += 1
                time.sleep(delays)
      
        if not is_ok:
            raise last_exception
      
        if response.getcode() > 200:
            raise Error("urlopen code: %d url: %s" % (response.getcode(), self.url))
      
        self.response_code = response.getcode()
        self.response_info = response.info()
        self.row_text = response.read()
        return self.row_text

class Session(object):

    def __init__(self, api_host, api_key, http_retries=5, http_delays=5, papi_retries=5, papi_delays=5):
        self.api_host = api_host
        self.api_key = api_key
        self.http_retries = http_retries
        self.http_delays = http_delays
        self.papi_retries = papi_retries
        self.papi_delays = papi_delays

    def fetch(self, url, params):
        page = Page("http://api.%s/%s/?application_id=%s&%s" % (self.api_host, url, self.api_key, params))
        count = 0
        while count < self.papi_retries:
            resp = json.loads(page.fetch(retries=self.http_retries, delays=self.http_delays))
            if resp['status'] == 'ok':
                return resp['data']
            count += 1
            logging.info("### PAPI retry %d %s" % (count, page.url))
            time.sleep(self.papi_delays)

        raise Error(repr(resp))

    # trick for check for deleted clan
    def isClanDeleted(self, clan_id):
        """isClanDeleted(clan_id)\nReturn check for deleted clan"""
        page = Page("http://api.%s/%s/?application_id=%s&%s" % (self.api_host, 'wot/clan/provinces', self.api_key, 'clan_id=%d' % clan_id))
        count = 0

        while count < self.papi_retries:

            r = json.loads(page.fetch(retries=self.http_retries, delays=self.http_delays))
            if r['status'] == 'ok':
                return False
            elif (r['status'] == 'error') and (r['error']['code'] == 404) and (r['error']['message'] == 'CLAN_NOT_FOUND'):
                return True

            count += 1
            logging.info("### PAPI retry %d %s" % (count, page.url))
            time.sleep(self.papi_delays)

        return False

if __name__ == "__main__":
    import doctest
    doctest.testmod()
