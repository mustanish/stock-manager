const resolver = {
  Query: {
    profile: (root, args, context, info) => context.models.User.profile(args, context, info),
    variants: (root, args, context, info) =>
      context.models.Product.getVariants(args, context, info),
    categories: (root, args, context, info) =>
      context.models.Product.getCategories(args, context, info),
    manufacturers: (root, args, context, info) =>
      context.models.Manufacturer.getManufacturers(args, context, info),
    products: (root, args, context, info) =>
      context.models.Product.getProducts(args, context, info),
    suppliers: (root, args, context, info) =>
      context.models.Supplier.getSuppliers(args, context, info),
  },
};

module.exports = resolver;
