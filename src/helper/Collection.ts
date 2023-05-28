export default class Collection<Model> {
    models: Model[];

    constructor(models: Model[] = []) {
        this.models = models;
    }

    first() {
        if (this.models.length == 0) {
            return undefined;
        }
        return this.models[0];
    }

    last() {
        if (this.models.length == 0) {
            return undefined;
        }
        return this.models[this.models.length - 1];
    }

    get() {
        return this.models;
    }

    where(field: keyof Model, operator: string, value: any) {
        const newCollection = new Collection<Model>([]);
        for (const model of this.models) {
            if (operator == '=') {
                if (model[field] == value) {
                    newCollection.models.push(model);
                }
            } else if (operator == '!=') {
                if (model[field] != value) {
                    newCollection.models.push(model);
                }
            } else if (operator == '>') {
                if (model[field] > value) {
                    newCollection.models.push(model);
                }
            } else if (operator == '>=') {
                if (model[field] >= value) {
                    newCollection.models.push(model);
                }
            } else if (operator == '<') {
                if (model[field] < value) {
                    newCollection.models.push(model);
                }
            } else if (operator == '<=') {
                if (model[field] <= value) {
                    newCollection.models.push(model);
                }
            } else if (operator == 'like') {
                if ((model[field] as string).match(value)) {
                    newCollection.models.push(model);
                }
            } else if (operator == 'not like') {
                if (!(model[field] as string).match(value)) {
                    newCollection.models.push(model);
                }
            } else if (operator == 'in') {
                if (value.includes(model[field])) {
                    newCollection.models.push(model);
                }
            } else if (operator == 'not in') {
                if (!value.includes(model[field])) {
                    newCollection.models.push(model);
                }
            }
        }
        return newCollection;
    }

    sort(key: keyof Model, order: 'asc' | 'desc') {
        this.models.sort((a, b) => {
            if (a[key] > b[key]) {
                return order == 'asc' ? 1 : -1;
            } else if (a[key] < b[key]) {
                return order == 'asc' ? -1 : 1;
            }
            return 0;
        });
        return this;
    }
}
