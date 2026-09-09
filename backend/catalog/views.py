from django.db.models import Q
from rest_framework import status
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Product
from .serializers import ProductSerializer

CATEGORY_CHOICES = [
    "computers",
    "laptops",
    "printers",
    "cctv",
    "gaming",
    "accessories",
]


def public_product(p: Product) -> dict:
    """Shape the payload the frontend expects (mockBackend-compatible)."""
    return {
        "id": p.id,
        "name": p.name,
        "brand": p.brand,
        "category": p.category,
        "categoryName": p.category_name,
        "tagline": p.tagline,
        "description": p.description,
        "price": float(p.price),
        "mrp": float(p.mrp) if p.mrp is not None else float(p.price),
        "discount": p.discount,
        "stock": p.stock,
        "rating": p.rating,
        "reviewCount": p.review_count,
        "specs": p.specs or {},
        "tags": p.tags or [],
        "images": p.images or ([p.image] if p.image else []),
        "gallery": p.images or ([p.image] if p.image else []),
        "img": p.image,
        "inStock": p.stock > 0,
        "createdAt": p.created_at.isoformat() if p.created_at else None,
    }


def query_products(params):
    """Shared search + filter logic (admin list and public catalogue reuse it)."""
    qs = Product.objects.all()

    # Search — partial match on product name (plus brand/tagline as bonus).
    search = (params.get("search") or params.get("q") or "").strip()
    if search:
        qs = qs.filter(Q(name__icontains=search) | Q(brand__icontains=search) | Q(tagline__icontains=search))

    brand = (params.get("brand") or "").strip()
    if brand:
        qs = qs.filter(brand__iexact=brand)

    category = (params.get("category") or "").strip()
    if category:
        qs = qs.filter(category=category)

    max_price = params.get("maxPrice") or params.get("max_price")
    if max_price not in (None, "", 0, "0"):
        try:
            qs = qs.filter(price__lte=float(max_price))
        except (TypeError, ValueError):
            pass

    min_price = params.get("minPrice") or params.get("min_price")
    if min_price not in (None, ""):
        try:
            qs = qs.filter(price__gte=float(min_price))
        except (TypeError, ValueError):
            pass

    # Stock availability filter: "in" (in stock), "out" (out of stock), "" all.
    stock = (params.get("stock") or "").strip().lower()
    if stock == "in":
        qs = qs.filter(stock__gt=0)
    elif stock == "out":
        qs = qs.filter(stock=0)

    min_rating = params.get("minRating")
    if min_rating not in (None, "", 0, "0"):
        try:
            qs = qs.filter(rating__gte=float(min_rating))
        except (TypeError, ValueError):
            pass

    return qs


class ProductListCreateView(ListCreateAPIView):
    """GET (list/search/filter) + POST (create) /api/products/"""

    serializer_class = ProductSerializer

    def get_queryset(self):
        return query_products(self.request.query_params)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        product = serializer.save()
        return Response(
            {"message": "Product created successfully.", "product": public_product(product)},
            status=status.HTTP_201_CREATED,
        )


class ProductDetailView(RetrieveUpdateDestroyAPIView):
    """GET / PUT / PATCH / DELETE /api/products/<id>/"""

    queryset = Product.objects.all()
    serializer_class = ProductSerializer

    def retrieve(self, request, *args, **kwargs):
        return Response(public_product(self.get_object()))

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop("partial", False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        product = serializer.save()
        return Response({"message": "Product updated successfully.", "product": public_product(product)})

    def destroy(self, request, *args, **kwargs):
        product = self.get_object()
        name = product.name
        product.delete()
        return Response({"message": f"Product '{name}' deleted successfully."}, status=status.HTTP_200_OK)


class AdminProductListCreateView(ProductListCreateView):
    """GET / POST /api/admin/products/ — returns the flat list the admin table expects."""

    def list(self, request, *args, **kwargs):
        qs = self.filter_queryset(self.get_queryset())
        return Response([public_product(p) for p in qs])


class AdminProductDetailView(ProductDetailView):
    """PUT / PATCH / DELETE /api/admin/products/<id>/"""


class BrandsView(APIView):
    """GET /api/brands/ — distinct brand names for filter dropdowns."""

    def get(self, request):
        brands = (
            Product.objects.exclude(brand="").order_by("brand").values_list("brand", flat=True).distinct()
        )
        return Response(list(brands))


class CategoriesView(APIView):
    """GET /api/categories/ — active category keys from the database."""

    def get(self, request):
        cats = Product.objects.exclude(category="").values_list("category", flat=True).distinct()
        return Response(sorted(set(cats) & set(CATEGORY_CHOICES)) or sorted(set(cats)))
