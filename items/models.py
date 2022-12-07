from django.db import models

# Create your models here.


class Item(models.Model):
    name = models.CharField(max_length=100)
    price = models.FloatField()
    duration = models.DurationField()

    def __str__(self):
        return f'{self.name} - {self.price} ({self.duration})'
