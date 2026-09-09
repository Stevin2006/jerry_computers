from rest_framework import serializers

from .models import Product


class ProductSerializer(serializers.ModelSerializer):
    discount = serializers.IntegerField(read_only=True)
    category_name = serializers.CharField(read_only=True)
    image = serializers.URLField(required=False, allow_blank=True)
    images = serializers.JSONField(required=False, default=list)

    class Meta:
        model = Product
        fields = [
            "id",
            "name",
            "brand",
            "category",
            "category_name",
            "tagline",
            "description",
            "price",
            "mrp",
            "stock",
            "image",
            "images",
            "specs",
            "tags",
            "rating",
            "review_count",
            "discount",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at", "rating", "review_count", "discount", "category_name"]

    def validate_price(self, value):
        if value is None or value <= 0:
            raise serializers.ValidationError("Enter a valid price.")
        return value

    def validate_stock(self, value):
        if value < 0:
            raise serializers.ValidationError("Stock cannot be negative.")
        return value

    def to_internal_value(self, data):
        ret = super().to_internal_value(data)
        # Normalise: if `images` provided, use it; else fall back to `image`.
        request = self.context.get("request")
        payload = request.data if request is not None else {}
        images = payload.get("images")
        image = payload.get("image")
        if images in (None, "", []):
            ret["images"] = [image] if image else []
        else:
            ret["images"] = images if isinstance(images, list) else [images]
        if "image" not in ret and images:
            ret["image"] = images[0]
        if "image" in ret and not ret["image"] and ret["images"]:
            ret["image"] = ret["images"][0]
        return ret
