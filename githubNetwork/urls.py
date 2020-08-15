
from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login/", views.login_view, name="login"),
    path("register/", views.register_view, name="register"),
    path("logout/", views.logout_view, name="logout"),
    path("repos/", views.repoList, name="repos"),
    path("repo/<str:repo_id>/", views.repo, name="repoPost"),
    path("newRepo/", views.createRepo, name="createRepo"),
    path("deleteRepo/<str:repo_id>", views.deleteRepo, name="deleteRepo"),
    path("comment/<int:repo_id>", views.addComment, name="addComment"),
    path("comment/delete", views.deleteComment, name="deleteComment"),
    path("isAuthenticated", views.isAuthenticated, name="authenticate"),
]
