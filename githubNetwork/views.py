from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.shortcuts import render
from django.db import IntegrityError
from django.http import JsonResponse, HttpResponse, HttpResponseRedirect
from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.views.decorators.csrf import csrf_exempt
from .config import token
import json
import requests

from .serializers import RepoSerializer
from .models import User, Repo, Comment

# Create your views here.

# @api_view(['GET', 'POST'])
@api_view(['GET'])
def index(request):
  # return JsonResponse({ "message": "salve felipe" })
  # convert to a json rest framework response, to api response
  # https://www.django-rest-framework.org/tutorial/2-requests-and-responses/

  # return overview of url patterns
  # return Response({"message": "Salve Felipe" })
  api_urls = {
    'Repos list': '/repos/',
    'Repo post': '/repo/<str:pk>/',
    'Create repo post': '/newPost/',
    'Delete repo post': '/deletePost/<str:pk>',
    'isAuthenticated?': '/isAuthenticated',
    'addComment': '/comment/<int:repo_id>',
     # here I pass the comment id in the body, not in params
    'deleteComment': '/comment/delete',
    'register': '/register',
    'login': '/login',
    'logout': '/logout',

  }
  return Response(api_urls)

# @api_view(['GET'])
# @login_required(url="")
# def getUser(request):
#   user = User.objects.get(username=request.user.username)
#   return Response(user)
  

@api_view(['GET'])
def repoList(request):
  # print(request)
  # print(request.session)

  repos = Repo.objects.all().order_by("-id")
  # for repo in repos:
  #   print(repo)
  serializer = RepoSerializer(repos, many=True)
  # print(serializer.data)
  # many = list 
  return Response(serializer.data)

@api_view(['GET'])
def repo(request, repo_id):
  repo = Repo.objects.get(pk=repo_id)
  comments = Comment.objects.filter(repo=repo)
  serializer = RepoSerializer(repo, many=False)

  commentsInPost = []
  for comment in comments:
    commentsInPost.append(comment.serialize())

  post = { "repo": {}, "comments": [] }
  repo = serializer.data
  post['repo'] = repo
  post['comments'] = commentsInPost

  # print("Felipe")
  # print(post)
  return Response(post)

@api_view(['POST'])
def addComment(request, repo_id):
  if not request.user.is_authenticated:
    return Response({ "error": "Login required"})

  comment = request.data['comment']
  repo = Repo.objects.get(pk=repo_id)
  user = request.user

  comment_model=Comment(comment=comment, repo=repo, user=user)
  comment_model.save()
  comment = comment_model.serialize()
  return Response({ "comment": comment })

@api_view(['POST'])
def deleteComment(request):
  data = request.data['data']
  comment = data['comment']
  repo = data['repo']
  user = data['user']

  if request.user.username != user:
    return Response({ "error": "Unauthorized"})

  user = User.objects.get(username=user)
  repo = Repo.objects.get(pk=repo)

  comment = Comment.objects.get(comment=comment, repo=repo, user=user)
  removeState = comment.serialize()
  comment.delete()
  return Response({ "message": "Comment deleted", "comment": removeState })

@api_view(['POST'])
def createRepo(request):
  # json.loads is not working, what works with djangorest is request.data
  # print(request.data)
  if not request.user.is_authenticated:
    return Response({ "error": "Login required"})

  data = request.data['data']
  title = data['title']
  description = data['description']
  identity = data['githubURL']
  # http://github.com/USER/REPO
  # the same idea in our RepoState.js but in python
  slash = 0;
  inital = 0;
  final = 0;
  i = 0
  while i < len(identity):
    if slash == 2:
      inital = i
    if slash == 3:
      final = i
    if identity[i] == '/':
      slash += 1
    i += 1

  user = identity[inital+1:final]
  repo = identity[final+1:len(identity)]

  response = requests.get(f"https://api.github.com/repos/{user}/{repo}",
  headers={'Authorization': f"token {token['githubToken']}"})
  result = response.json()
  
  if response.status_code != 200:
    return Response({ "error": "Invalid Repo URL" })

  # print(request.user)
  if not title or not description:
    return Response({ "error": "Invalid Submit" })

  if "http://github.com" in identity or "https://github.com" in identity or "https://www.github.com" in identity:
    data = Repo(user=request.user, titleRepoPost=title, descriptionRepoPost=description, identityInGithub=identity)
    data.save()
    return Response(request.data)
    # return Response({"oi": "oi"})
  else:
    return Response({ "error": "Invalid Repo URL" })

  

@api_view(['DELETE'])
def deleteRepo(request, repo_id):
  repo=Repo.objects.get(id=repo_id)
  if request.user == repo.user:
    repo.delete()
    return Response({ "message": "Post deleted"})
  else:
    return Response({ "error": "Unauthorized"})

@api_view(['POST'])
def login_view(request):
  # when we do the project from scratch, we find that the view cannot named - login(request) because login function
  if request.method == "POST":
    data = json.loads(request.body).get('data')
    user = authenticate(request, username=data['username'], password=data['password'])
    
    if user is not None:
      login(request, user)
      # requset must be a isntance of django.httpresposne not django_rest.Response
      # print(request.user)
      user = request.user.username
      
      return JsonResponse({ "user": user })
    else:
      return JsonResponse({ "error": "Invalid credentials" })
  
@api_view(['GET'])
def isAuthenticated(request):
  # notice that this only works in localhost:3000 because we have the sessionid cookie, incognito don't allow cookies
  # and 127.0.0.8:8000/api/isAuthenticated doesn't have that cookie. Because the page authenticated have the request
  # object with that sessionid cookie
  # if I go to 127.0.0.8:8000/api/login and pass in the body { "data": { "username": "admin", "password": "djangoadmin" }}
  # a sessionid is stored in our cookies and we can authenticate because request has access to session
  # that's really nice, because we make sure that someone is really who the browser say he are
  if request.user.is_authenticated:
    return Response({ "message": "Authenticated", "user": request.user.username })
  else:
    return Response({ "message": "Not authenticated" })


@api_view(['GET'])
def logout_view(request):
  if request.user.is_authenticated:
    logout(request)
    return Response({ "message": "Logout" })
  else:
    return Response({ "error": "Already not Logged" })

@api_view(['POST'])
def register_view(request):
  data = request.data['data']

  if data['password'] != data['confirm']:
    return Response({ "error": "Passwords must mach" })

  username = data['username']
  email = data['email']
  password = data['password']

  try:
    user = User.objects.create_user(username, email, password)
    user.save()
  except IntegrityError:
    # name IntegrityError is not defined, import
    return Response({ "error": "Username already taken"})

  login(request, user)
  # now works, with api_view decorators
  # print(request) == rest_framework.request
  return Response({ "user": request.user.username })

