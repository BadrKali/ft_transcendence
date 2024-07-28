from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.decorators import api_view


# Create your views here.
user_id = 1

@api_view()
def RetreiveContacts(request):

    return Response('Response ++ getted VIEW HANDLE')
