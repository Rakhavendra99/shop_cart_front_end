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
