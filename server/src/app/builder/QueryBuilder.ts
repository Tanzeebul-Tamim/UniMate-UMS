  import { FilterQuery, Query } from 'mongoose';

//! Find the raw version on 28th commit on student.service.ts

class QueryBuilder<T> {
  public modelQuery: Query<T[], T>;
  public query: Record<string, unknown>;

  constructor(modelQuery: Query<T[], T>, query: Record<string, unknown>) {
    this.modelQuery = modelQuery;
    this.query = query;
  }

  search(searchableFields: string[]) {
    const searchTerm = this?.query?.searchTerm;

    if (searchTerm) {
      this.modelQuery = this?.modelQuery.find({
        $or: searchableFields.map(
          (field) =>
            ({
              [field]: { $regex: searchTerm, $options: 'i' },
            }) as FilterQuery<T>,
        ),
      });
    }

    return this;
  }

  filter() {
    //* Make a copy of the query
    const queryObj = { ...this?.query };

    //* Filter the query parameters
    const excludeFields = ['searchTerm', 'sort', 'limit', 'page', 'fields'];
    excludeFields.forEach((element) => delete queryObj[element]);

    //* Modifying the query for case insensitive search
    const queryObjKeys = Object.keys(queryObj);
    const queryObjValues = Object.values(queryObj);
    const modifiedQueryObj = {
      [queryObjKeys[0]]: { $regex: queryObjValues[0], $options: 'i' },
    };

    //* Checking for queries and making conditions for with and without a query
    if (Object.keys(queryObj).length === 0) {
      this.modelQuery = this.modelQuery.find(queryObj as FilterQuery<T>);
    } else {
      this.modelQuery = this.modelQuery.find(
        modifiedQueryObj as FilterQuery<T>,
      );
    }

    return this;
  }

  sort() {
    const sort =
      (this?.query?.sort as string)?.split(',')?.join(' ') || '-createdAt';

    this.modelQuery = this?.modelQuery.sort(sort as string);

    return this;
  }

  paginate() {
    const page = Number(this?.query?.page) || 1;
    const limit = Number(this?.query?.limit) || 0;
    const skip = (page - 1) * limit;

    this.modelQuery = this?.modelQuery
      .skip(skip as number)
      .limit(limit as number);

    return this;
  }

  fields() {
    const fields =
      (this?.query?.fields as string)?.split(',')?.join(' ') || '-__v';

    this.modelQuery = this?.modelQuery?.select(fields as string);

    return this;
  }
}

export default QueryBuilder;
