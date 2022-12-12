from django.db import models

# Create your models here.


class Item(models.Model):
    name = models.CharField(max_length=100)
    price = models.FloatField()
    duration = models.DurationField()
    description = models.CharField(max_length=500, blank=True, null=True)
    # created_at = models.DateTimeField(auto_now_add=True)
    item_image = models.URLField(
        max_length=300, default=None, blank=True, null=True)
    categories = models.ManyToManyField(
        'categories.Category',
        related_name='items'
    )
    owner = models.ForeignKey(
        'jwt_auth.User',
        related_name='items',
        on_delete=models.CASCADE
    )

    def __str__(self):
        return f'{self.name} - {self.price} ({self.duration})'
