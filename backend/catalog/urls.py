from django.urls import include, path

from . import views

urlpatterns = [
    # Public catalogue (list + create + search/filter)
    path("products/", views.ProductListCreateView.as_view(), name="product-list"),
    path(
        "products/<int:pk>/",
        views.ProductDetailView.as_view(),
        name="product-detail",
    ),
    path("brands/", views.BrandsView.as_view(), name="brands"),
    path("categories/", views.CategoriesView.as_view(), name="categories"),
    # Admin endpoints (used by the Product Management page)
    path("admin/products/", views.AdminProductListCreateView.as_view(), name="admin-product-list"),
    path(
        "admin/products/<int:pk>/",
        views.AdminProductDetailView.as_view(),
        name="admin-product-detail",
    ),
]
