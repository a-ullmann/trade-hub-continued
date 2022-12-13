from django.db import models

# Create your models here.


class Listings(models.Model):
    name = models.CharField(max_length=100)
    price = models.FloatField()
    duration = models.IntegerField()
    description = models.CharField(max_length=500, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    item_image = models.URLField(
        max_length=300, default=None, blank=True, null=True)
    category = models.ForeignKey(
        'category.Category',
        related_name='listings',
        default=None,
        on_delete=models.CASCADE
    )
    owner = models.ForeignKey(
        'jwt_auth.User',
        related_name='listings',
        on_delete=models.CASCADE
    )

    def __str__(self):
        return f'{self.name} - {self.price} ({self.duration})'


class Purchases(models.Model):
    buyer = models.CharField(max_length=100)
    listing = models.ForeignKey(Listings, on_delete=models.CASCADE)
