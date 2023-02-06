export function logInkaError(error: any, message: string) {
    console.log(
        `
**** inka error ****

MESSAGE: ${message}

ERROR: ${error}

**** end error ****
`)
}