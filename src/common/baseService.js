class BaseService {
  constructor(model) {
    this.model = model;
  }

  async create(data) {
    return this.model.create(data);
  }

  async findOne(filter = {}, options = {}) {
    let query = this.model.findOne(filter);

    if (options.select) {
      query = query.select(options.select);
    }

    if (options.projection) {
      query = query.select(options.projection);
    }

    return query.lean();
  }

  async findById(id, projection = {}) {
    return this.model.findById(id, projection).lean();
  }

  async updateById(id, data, options = { new: true }) {
    return this.model.findByIdAndUpdate(id, data, options).lean();
  }

  async deleteById(id) {
    return this.model.findByIdAndDelete(id);
  }

  async findAll({
    filters = {},
    projection = {},
    search,
    searchFields = [],
    page = 1,
    limit = 10,
    sort = { createdAt: -1 },
  }) {
    page = Number(page);
    limit = Number(limit);
    const skip = (page - 1) * limit;

    const match = { ...filters };

    if (search && searchFields.length) {
      match.$or = searchFields.map((field) => ({
        [field]: { $regex: search, $options: "i" },
      }));
    }

    const pipeline = [
      { $match: match },
      { $sort: sort },
      {
        $facet: {
          rows: [
            { $skip: skip },
            { $limit: limit },
            Object.keys(projection).length ? { $project: projection } : null,
          ].filter(Boolean),
          count: [{ $count: "total" }],
        },
      },
    ];

    const result = await this.model.aggregate(pipeline).allowDiskUse(true);

    const rows = result[0]?.rows || [];
    const count = result[0]?.count[0]?.total || 0;

    return {
      rows,
      count,
      page,
      limit,
      totalPages: Math.ceil(count / limit),
    };
  }
}

export default BaseService;
