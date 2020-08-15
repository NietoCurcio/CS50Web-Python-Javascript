from django.contrib import admin
from .models import User, Repo, Comment

# Register your models here.
class RepoAdmin(admin.ModelAdmin):
  list_display = ("id","user", "titleRepoPost", "descriptionRepoPost", "identityInGithub")
class CommentAdmin(admin.ModelAdmin):
  list_display = ("id", "user", "repo")

admin.site.register(User)
admin.site.register(Repo, RepoAdmin)
admin.site.register(Comment, CommentAdmin)