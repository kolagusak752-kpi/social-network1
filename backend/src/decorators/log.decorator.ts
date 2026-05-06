
import * as fs from 'fs';
import * as path from 'path';

interface LogOptions {
    level: 'info' | 'error' | 'debug';
    mode: 'file' | 'console';
}
export function Logger(options: LogOptions) {
    return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value;
        descriptor.value = function(...args: any[]) {
            const writeLog = () => {
                const possibleMessages:string[] = []
                if(options.level === 'info') {
                    possibleMessages.push('Success', 'Error')
                }
                else if(options.level === "debug") {
                    possibleMessages.push('Success', 'Error', "Started")
                } else if(options.level === 'error') {
                    possibleMessages.push('Error')
                }
                return function (message: string, data?: any) {
                    if(!possibleMessages.includes(message)) {
                    return
                }
                const timeStamp = new Date().toISOString()
                const log = JSON.stringify({methodName: propertyKey, timeStamp, message, data})
                if(options.mode === 'file') {
                    const filePath = path.join(process.cwd(), "./src/logs/log.txt")
                    fs.appendFileSync(filePath, log + '\n', "utf-8")
                }
                if(options.mode === 'console') {
                    console.log(log)
                }
            }
        }   
            const logger = writeLog()
            logger("Started")
            const time = performance.now()  
            try {
                const result = originalMethod.apply(this, args)
                if(result instanceof Promise) {
                    return result.then((res) => {
                        logger("Success", {processTime: Math.round(performance.now() - time)})
                        return res
                    }).catch((e) => {
                        logger("Error", {processTime: Math.round(performance.now() - time)})
                        throw e
                    })
                }
                logger("Success", {processTime: Math.round(performance.now() - time)})
                return result
            }
            catch(e) {
                logger("Error", {processTime: Math.round(performance.now() - time)})
                throw e
            }
        }
        return descriptor;
    }
}