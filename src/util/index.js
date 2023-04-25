export const convertToBase64 = (file) => new Promise((resolve, reject) => {
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
        console.log(reader.result);
        resolve(reader.result)
    };
    reader.onerror = (error) => {
        console.log('Error: ', error);
        reject(error)
    };

})
export const nameAndNumberOnlyCharactersRegex = new RegExp(`^[a-zA-Z0-9 -]+$`);
export const onlyNumbersRegex = new RegExp(`^[0-9]+$`);
export const nameOnlyCharactersRegex = new RegExp(`^[a-zA-Z -]+$`);
export const validateEmail = (email) => {
    const validEmailRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return validEmailRegex.test(email);
}