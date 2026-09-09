from django.db import models


class Product(models.Model):
    name = models.CharField(max_length=200)
    brand = models.CharField(max_length=100)
    category = models.CharField(max_length=50, db_index=True)
    description = models.TextField(blank=True)
    tagline = models.CharField(max_length=255, blank=True)
    price = models.DecimalField(max_digits=12, decimal_places=2)
    mrp = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    stock = models.PositiveIntegerField(default=0)
    image = models.URLField(blank=True)
    images = models.JSONField(default=list, blank=True)
    specs = models.JSONField(default=dict, blank=True)
    tags = models.JSONField(default=list, blank=True)
    rating = models.FloatField(default=0)
    review_count = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return self.name

    @property
    def discount(self) -> int:
        if self.mrp and self.mrp > self.price:
            return int(round(((self.mrp - self.price) / self.mrp) * 100))
        return 0

    @property
    def category_name(self) -> str:
        return (self.category or "").replace("-", " ").capitalize()
