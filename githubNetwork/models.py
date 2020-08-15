from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.
class User(AbstractUser):
    pass

class Repo(models.Model):
    user = models.ForeignKey("User", on_delete=models.CASCADE, related_name="repos")
    titleRepoPost = models.CharField(max_length=255)
    descriptionRepoPost = models.CharField(max_length=1250)
    identityInGithub = models.CharField(max_length=255)

    def __str__(self):
        return f"The user '{self.user}'' has a repo on github '{self.identityInGithub}' which has '{self.titleRepoPost}'' title and '{self.descriptionRepoPost}'' desc in our network"

    # like in the project Mail (project 3) the serialize allow us return a model object in Json response
    # def serialize(self):
    #   return {
    #       "id": self.id,
    #       "user": self.user,
    #       "titleRepoPost": self.titleRepoPost,
    #       "descriptionRepoPost": self.descriptionRepoPost,
    #   }

class Comment(models.Model):
    comment = models.CharField(max_length=1250)
    user = models.ForeignKey("User", on_delete=models.CASCADE, related_name="commentsUser")
    repo = models.ForeignKey("Repo", on_delete=models.CASCADE, related_name="commentsRepos")

    def serialize(self):
      return {
          "id": self.id,
          "comment": self.comment,
          "user": self.user.username,
          "repo": self.repo.id,
      }