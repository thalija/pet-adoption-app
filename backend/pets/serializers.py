from rest_framework import serializers
from dbmodels.models import Pets


class PetsSerializer(serializers.ModelSerializer):
    # Response / request keys (camelCase) mapped to DB columns
    petId = serializers.IntegerField(source="petid", read_only=True)

    # DB column animalType is VARCHAR(5)
    animalType = serializers.CharField(source="animaltype", max_length=5)

    dateCreated = serializers.DateTimeField(source="datecreated", read_only=True)
    createdBy = serializers.IntegerField(source="createdby_id", read_only=True)

    petPhoto = serializers.CharField(source="petphoto")

    # Allow null or blank because frontend may send "" instead of null
    newsItem = serializers.CharField(
        source="newsitem",
        allow_null=True,
        allow_blank=True,
        required=False,
    )

    goodWithChildren = serializers.IntegerField(source="goodwithchildren")
    goodWithAnimals = serializers.IntegerField(source="goodwithanimals")

    # Match DB column sizes
    availability = serializers.CharField(max_length=13)
    energy = serializers.CharField(max_length=6)

    class Meta:
        model = Pets
        fields = [
            "petId",
            "name",
            "animalType",
            "breed",
            "description",
            "availability",
            "dateCreated",
            "createdBy",
            "petPhoto",
            "newsItem",
            "goodWithChildren",
            "goodWithAnimals",
            "leashed",
            "energy",
        ]
        read_only_fields = ["petId", "dateCreated", "createdBy"]