from django.db import models


class Category(models.Model):
    name = models.CharField(max_length=50, unique=True)
    subcategories = models.ForeignKey(
        'subcategories.Subcategory',
        related_name='items',
        on_delete=models.CASCADE
    )

    def __str__(self):
        return self.name
