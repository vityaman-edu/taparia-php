
export namespace Utility {
    export function deepConvertToMap(object: Object): Map<String, any> {
        return new Map(
            Object
                .entries(object)
                .map(entry => {
                    if (entry[1] instanceof Array) {
                        return [entry[0], entry[1].map(deepConvertToMap)];
                    }
                    if (entry[1] instanceof Object) {
                        return [entry[0], deepConvertToMap(entry[1])];
                    }
                    return [entry[0], entry[1]];
                })
        );
    }
}
