from django.db import models


class Subcategory(models.Model):
    name = models.CharField(max_length=50)
    categories = models.ForeignKey(
        'categories.Category',
        related_name='subcategories',
        on_delete=models.CASCADE
    )

    def __str__(self):
        return f'{self.name} - {self.categories}'
