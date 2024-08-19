/**
 * @author Joshua Oyeleke <oyelekeoluwasayo@gmail.com>
 **/

import {
  IBuildQueryOptions,
  IBuildQueryOptionsResponse,
  INestedPopulateOption,
  IPopulateOption,
  ISeekConditions,
} from "@/types/general";

const buildQuery = (
  options: IBuildQueryOptions
): IBuildQueryOptionsResponse => {
  const sort_condition = options.sort_by
    ? buildSortOrderString(options.sort_by)
    : "";
  const fields_to_return = options.return_only
    ? buildReturnFieldsString(options.return_only)
    : "";
  const count = options.count || false;
  let seek_conditions: ISeekConditions = {
    // ...buildBooleanQuery(options.bool || '')
  };

  if (options.bool) {
    seek_conditions = {
      ...buildBooleanQuery(options.bool || ""),
    };
  }

  const { skip, limit } = determinePagination(options.page, options.population);
  const populate =
    (options.include && buildIncludeQuery(options.include)) || [];

  /** Delete sort and return fields */
  delete options.bool;
  delete options.count;
  delete options.page;
  delete options.population;
  delete options.return_only;
  delete options.sort_by;
  delete options.include;

  Object.keys(options).forEach((field) => {
    if (field.trim()) {
      const field_value = options[field] ? options[field].toString() : "";

      let condition;

      if (field_value.includes(":")) {
        condition = buildInQuery(field_value);
      } else if (field_value.includes("!")) {
        condition = buildNorQuery(field_value);
      } else if (field_value.includes("~")) {
        condition = buildRangeQuery(field_value);
      } else {
        condition = buildOrQuery(field_value);
      }

      seek_conditions[field] = { ...condition };
    }
  });

  return {
    count,
    fields_to_return,
    limit,
    seek_conditions,
    skip,
    sort_condition,
    populate,
  };
};

const buildBooleanQuery = (value: string) => {
  const values = value.split(",");
  return values.reduce((sac: ISeekConditions, val: string) => {
    let truthiness = true;
    let key = val;
    if (val[0] === "-") {
      truthiness = false;
      key = val.substr(1);
    }

    return {
      ...sac,
      [key]: truthiness,
    };
  }, {});
};

const buildInQuery = (value: string) => {
  const values = value.split(":");
  return {
    $in: [...values],
    // $in: [...values.map((val) => new RegExp(val, "i"))],
  };
};

const buildNorQuery = (value: string) => {
  const values = value.split("!");
  return {
    $nin: [...values.slice(1)],
  };
};

const buildOrQuery = (value: string) => {
  const values = value.split(",");
  return {
    // $in: [...values],
    $in: [
      ...values.map((val) => {
        // Checking if the value contains letters before applying case insensitivity
        if (/^[a-zA-Z]+$/.test(val)) {
          return new RegExp(val, "i");
        }
        return val;
      }),
    ],
  };
};

const buildRangeQuery = (value: string) => {
  const [min, max] = value.split("~");
  return {
    $gte: min ? Number(min) : Number.MIN_SAFE_INTEGER,
    $lte: max ? Number(max) : Number.MAX_SAFE_INTEGER,
  };
};

const buildReturnFieldsString = (value: string) => {
  return value.replace(/,/gi, " ");
};

const buildSortOrderString = (value: string) => {
  return value.replace(/,/gi, " ");
};

const buildIncludeQuery = (include: string): IPopulateOption[] => {
  const includeList: string[] = include.split(",");
  const populateOptions: IPopulateOption[] = [];

  includeList.forEach((item) => {
    const parts: string[] = item.split(":");
    const path: string = parts[0];

    if (parts.length > 1) {
      const select: string = parts[1];
      const selectParts: string[] = select.split(";");
      let mainPopulate: IPopulateOption | null = null;

      selectParts.forEach((selectPart) => {
        const nestedParts: string[] = selectPart.split(":");
        const nestedPath: string = nestedParts[0];
        const nestedSelectFields: string = nestedParts[1];

        const nestedPopulateOption: INestedPopulateOption = {
          path: nestedPath,
          select: nestedSelectFields,
          populate: null,
        };

        if (mainPopulate) {
          if (!mainPopulate.populate) {
            mainPopulate.populate = [nestedPopulateOption];
          } else {
            mainPopulate.populate.push(nestedPopulateOption);
          }
        } else {
          mainPopulate = {
            path,
            select: selectParts.join(" "),
            populate: [nestedPopulateOption],
          } as IPopulateOption; // Explicitly cast to IPopulateOption
        }
      });

      if (mainPopulate) {
        populateOptions.push(mainPopulate);
      }
    } else {
      populateOptions.push({ path } as IPopulateOption); // Explicitly cast to IPopulateOption
    }
  });

  return populateOptions;
};

const buildWildcardOptions = (key_list: string, value: string) => {
  const keys = key_list.split(",");

  return {
    $or: keys.map((key) => ({
      [key]: {
        $regex: value || "",
        $options: "i",
      },
    })),
  };
};

const determinePagination = (
  page: number = 0,
  population: number = Number.MAX_SAFE_INTEGER
) => {
  return {
    limit: Number(population),
    skip: page * population,
  };
};

export {
  buildInQuery,
  buildNorQuery,
  buildOrQuery,
  buildQuery,
  buildRangeQuery,
  buildReturnFieldsString,
  buildSortOrderString,
  buildWildcardOptions,
  determinePagination,
};
