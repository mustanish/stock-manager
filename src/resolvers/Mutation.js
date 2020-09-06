const resolver = {
  Mutation: {
    register: (root, args, context, info) => context.models.User.register(args, context, info),
    login: (root, args, context, info) => context.models.User.login(args, context, info),
    forgot: (root, args, context, info) => context.models.User.forgot(args, context, info),
    verify: (root, args, context, info) => context.models.User.verify(args, context, info),
    reset: (root, args, context, info) => context.models.User.reset(args, context, info),
    refresh: (root, args, context, info) => context.models.User.refresh(args, context, info),
    logout: (root, args, context, info) => context.models.User.logout(args, context, info),
    addProduct: (root, args, context, info) =>
      context.models.Product.addProduct(args, context, info),
    addManufacturer: (root, args, context, info) =>
      context.models.Manufacturer.addManufacturer(args, context, info),
    addSupplier: (root, args, context, info) =>
      context.models.Supplier.addSupplier(args, context, info),
    addBillItem: (root, args, context, info) =>
      context.models.BillItem.addBillItem(args, context, info),
  },
};

module.exports = resolver;
