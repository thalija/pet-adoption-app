# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey and OneToOneField has `on_delete` set to the desired behavior
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
from django.db import models


class Pets(models.Model):
    petid = models.AutoField(db_column='petID', primary_key=True)  # Field name made lowercase.
    name = models.CharField(max_length=100)
    animaltype = models.CharField(db_column='animalType', max_length=5)  # Field name made lowercase.
    breed = models.CharField(max_length=255)
    description = models.TextField()
    availability = models.CharField(max_length=13)
    datecreated = models.DateTimeField(db_column='dateCreated')  # Field name made lowercase.
    createdby = models.ForeignKey('Users', models.DO_NOTHING, db_column='createdBy')  # Field name made lowercase.
    petphoto = models.CharField(db_column='petPhoto', max_length=500)  # Field name made lowercase.
    newsitem = models.TextField(db_column='newsItem', blank=True, null=True)  # Field name made lowercase.
    goodwithchildren = models.IntegerField(db_column='goodWithChildren')  # Field name made lowercase.
    goodwithanimals = models.IntegerField(db_column='goodWithAnimals')  # Field name made lowercase.
    leashed = models.IntegerField()
    energy = models.CharField(max_length=6)

    class Meta:
        managed = False
        db_table = 'pets'


class Users(models.Model):
    userid = models.AutoField(db_column='userID', primary_key=True)  # Field name made lowercase.
    email = models.CharField(unique=True, max_length=145)
    password = models.CharField(max_length=255)
    role = models.CharField(max_length=6)
    datecreated = models.DateTimeField(db_column='dateCreated')  # Field name made lowercase.
    children = models.IntegerField(blank=True, null=True)
    activity = models.CharField(max_length=6, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'users'
