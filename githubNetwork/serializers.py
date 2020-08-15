# https://www.django-rest-framework.org/tutorial/1-serialization/
# the way of create a method serialize in the model doesn't work, that's is the way of doc
from rest_framework import serializers
from .models import Repo

class RepoSerializer(serializers.ModelSerializer):
  user = serializers.SlugRelatedField(
            slug_field='username',
            read_only='True'
        )
  class Meta:
    model = Repo
    fields = ['id','user', 'titleRepoPost', 'descriptionRepoPost', 'identityInGithub']
    # '__all__'