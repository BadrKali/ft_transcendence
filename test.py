import sys

sys.path.append('/goinfre/bel-kala/ft_transcendence/env/lib/python3.9/site-packages/')

import time
import requests

cache = {
    "access_token_created_at" : 0,
    "access_token_end_at"     : 0,
    "expires_in"              : 0,
    "access_token"            : ""
}

def get_42access_token():
    # if (time.time() < cache["access_token_end_at"]):
    #     print ("from cache!")
    #     return (cache["access_token"])

    rsp = requests.post(
        url = "https://api.intra.42.fr/oauth/token",
        data = {
            'grant_type'  : 'client_credentials', # client_credentials
            'client_id'    : "u-s4t2ud-18b1720f14dffbeb3b422170a77366fdaa14d72c18405a86f15053c0f21ee25a",
            'client_secret': "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",
        }
    )
    access_token = ""
    if (rsp.status_code == 200):
        jrsp = rsp.json()
        access_token = rsp.json()["access_token"]
        cache["access_token_created_at"] = time.time()
        cache["access_token_end_at"]     = time.time() + jrsp["expires_in"]
        cache["expires_in"]              = jrsp["expires_in"]
        cache["access_token"]            = access_token

    print ("from API!")


    return (access_token)

def get_user_42access_token():
    rsp = requests.post(
        url = "https://api.intra.42.fr/oauth/token",
        data = {
            'grant_type'  : 'authorization_code',
            'client_id'    : "u-s4t2ud-18b1720f14dffbeb3b422170a77366fdaa14d72c18405a86f15053c0f21ee25a",
            'client_secret': "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",
            "code"         : "fd778a223516397231e456133b2277173dd89d5bc5f0df364d19c8e75947bdaf",
            "redirect_uri" : "http://localhost:3130/auth/"
        }
    )
    access_token = ""
    if (rsp.status_code == 200):
        jrsp = rsp.json()
        print (jrsp)
        access_token = rsp.json()["access_token"]
    print (access_token)
    return (access_token)



# for i in range(1000):
#     get_42access_token()


# exit()

access_tok = get_user_42access_token()
print(access_tok)

def get42(path):
    path = path.strip("/")
    url  = "https://api.intra.42.fr/v2/" + path

    rsp = requests.get(
        url = url,
        headers = {
             'Authorization': 'Bearer ' + access_tok,
            #  "Accept" : "application/json"
        }
    )
    print(rsp.json())


print (get42("/me"))
print("==============")

print (get42("/me"))
print("==============")

print (get42("/me"))
print("==============")

print (get42("/me"))
print("==============")