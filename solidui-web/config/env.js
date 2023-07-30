
const productionVariable = ["NODE_ENV", "BASE_ENV"]
const developmentVariable = ["NODE_ENV", "BASE_ENV", "PROXY_SERVER", "SERVER_PORT"]

module.exports = {
    "production": productionVariable,
    "development": developmentVariable,
    filter(isDev = true, originEnvObj = {}) {
        const newObj = {}
        Object.entries(originEnvObj).forEach(([key, value]) => {
            if (typeof value !== "string" && typeof value !== "number") return
            if ((isDev && developmentVariable.includes(key)) || (!isDev && productionVariable.includes(key))) {
                newObj[key] = value
            }
        })
        return newObj
    }
}
